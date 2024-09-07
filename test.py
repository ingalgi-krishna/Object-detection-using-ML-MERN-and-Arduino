import cv2
# Start video capture with reduced resolution for faster processing
cap = cv2.VideoCapture('http://192.168.1.5:4748')
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 640)  # Set height to 640 for compatibility