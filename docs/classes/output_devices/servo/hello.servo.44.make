PROJECT=hello.servo.44
SOURCES=$(PROJECT).c
MMCU=attiny44
F_CPU = 20000000

CFLAGS=-mmcu=$(MMCU) -Wall -Os -DF_CPU=$(F_CPU)

$(PROJECT).hex: $(PROJECT).out
	avr-objcopy -O ihex $(PROJECT).out $(PROJECT).c.hex;\
	avr-size --mcu=$(MMCU) --format=avr $(PROJECT).out
 
$(PROJECT).out: $(SOURCES)
	avr-gcc $(CFLAGS) -I./ -o $(PROJECT).out $(SOURCES)
 
program-bsd: $(PROJECT).hex
	avrdude -p t44 -c bsd -U flash:w:$(PROJECT).c.hex

program-dasa: $(PROJECT).hex
	avrdude -p t44 -P /dev/ttyUSB0 -c dasa -U flash:w:$(PROJECT).c.hex

program-avrisp2: $(PROJECT).hex
	avrdude -p t44 -P usb -c avrisp2 -U flash:w:$(PROJECT).c.hex

program-avrisp2-fuses: $(PROJECT).hex
	avrdude -p t44 -P usb -c avrisp2 -U lfuse:w:0x5E:m

program-usbtiny: $(PROJECT).hex
	avrdude -p t44 -P usb -c usbtiny -U flash:w:$(PROJECT).c.hex

program-usbtiny-fuses: $(PROJECT).hex
	avrdude -p t44 -P usb -c usbtiny -U lfuse:w:0x5E:m

program-dragon: $(PROJECT).hex
	avrdude -p t44 -P usb -c dragon_isp -U flash:w:$(PROJECT).c.hex

program-dragon-fuses: $(PROJECT).hex
	avrdude -p t44 -P usb -c dragon_isp -U lfuse:w:0x5E:m

program-ice: $(PROJECT).hex
	avrdude -p t44 -P usb -c atmelice_isp -U flash:w:$(PROJECT).c.hex

program-ice-fuses: $(PROJECT).hex
	avrdude -p t44 -P usb -c atmelice_isp -U lfuse:w:0x5E:m

