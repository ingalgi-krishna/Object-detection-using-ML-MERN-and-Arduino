import cv2
import serial
import time
import requests
import torch
import numpy as np
from ultralytics import YOLO
from datetime import datetime
# Serial port configuration
serial_port = 'COM5'
baud_rate = 9601
ser = serial.Serial(serial_port, baud_rate, timeout=1)

# Check if CUDA is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Load YOLOv10 model
model = YOLO('yolov10l.pt')  
model.model.to(device)  
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 640) 

object_appearance = {}
appearance_threshold = 5

def send_to_backend(object_names):
    try:
        response = requests.post('http://localhost:5000/api/objects', json={'name': object_names})
        if response.status_code == 201:
            print(f"Data saved to database: {object_names}")
        else:
            print("Failed to save data to database")
    except Exception as e:
        print(f"Error sending data to backend: {e}")

frame_count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 2 == 0: 
        # Resize image to (640, 640)
        frame_resized = cv2.resize(frame, (640, 640))
        
        img = torch.from_numpy(frame_resized).permute(2, 0, 1).unsqueeze(0).float().to(device)
        img /= 255.0 

        results = model(img)

        detected_objects = set()

        # Process results
        for result in results:
            if hasattr(result, 'boxes'):
                boxes = result.boxes.xyxy.cpu().numpy()
                confidences = result.boxes.conf.cpu().numpy()
                class_ids = result.boxes.cls.cpu().numpy()

                for i in range(len(boxes)):
                    confidence = confidences[i]
                    if confidence > 0.5:
                        class_id = int(class_ids[i])
                        label = model.names[class_id]

                        x1, y1, x2, y2 = boxes[i]
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                        cv2.putText(frame, f'{label} ({confidence:.2f})', (int(x1), int(y1) - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                        detected_objects.add(label)
                        object_appearance[label] = datetime.now()

        current_time = datetime.now()
        objects_to_send = [label for label, timestamp in object_appearance.items() 
                           if (current_time - timestamp).total_seconds() > appearance_threshold]

        if objects_to_send:
            object_names = ", ".join(objects_to_send)
            ser.write(object_names.encode())
            ser.write(b'\n')
            send_to_backend(object_names) 
    cv2.imshow('Object Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

print(f"Model device: {next(model.model.parameters()).device}")
print(f"Tensor device: {img.device}")

cap.release()
cv2.destroyAllWindows()
ser.close()
