#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

int contrast = 100;  

void setup() {
  pinMode(6, OUTPUT);
  analogWrite(6, contrast); 
  lcd.begin(16, 2);  
  Serial.begin(9601);
  lcd.print("Waiting for"); 
  lcd.setCursor(0, 1);
  lcd.print("Object...");
}

void loop() {
  if (Serial.available() > 0) {
    String objectName = Serial.readStringUntil('\n');
    objectName.trim(); 

    lcd.clear(); 
    lcd.setCursor(0, 0);
    lcd.print("Detected:");
    lcd.setCursor(0, 1);
    lcd.print(objectName);  
      delay(2000); 
  }
}
