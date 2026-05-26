# Hello. — [Embedded Programming (2014)](../../../../../years/2014/Web/classes/old/embedded_programming/index.html)

---

<pre><font face="bitstream vera sans,arial,helvetica,sans-serif">

<b>assembly language</b>
   <a href=http://fab.cba.mit.edu/about/fab/hello/serial/hello.serial.45.hex>hex file</a>
   <a href=http://www.atmel.com/dyn/resources/prod_documents/doc0856.pdf>instruction set, opcodes</a>
   <a href=http://www.atmel.com/dyn/resources/prod_documents/doc1022.pdf>mnemonics, directives, expressions</a>
   <a href=http://www.atmel.com/dyn/Products/tools_card.asp?tool_id=2725>AVR Studio</a>
   <a href=http://www.nongnu.org/avr-libc/user-manual/using_tools.html>avr-as</a>
   <a href=http://www.avr-asm-tutorial.net/gavrasm/index_en.html>gavrasm</a>

---

<b>serial echo</b>
   <a href=http://fab.cba.mit.edu/about/fab/hello/echo/hello.echo.44.cad>hello.echo.44.cad</a>
   <a href=http://fab.cba.mit.edu/about/fab/hello/echo/hello.echo.44.asm>hello.echo.44.asm</a>
   <a href=http://fab.cba.mit.edu/about/fab/hello/echo/hello.echo.44.c>hello.echo.44.c</a>
   <a href=http://fab.cba.mit.edu/about/fab/hello/echo/makefile>makefile</a>
   tiny44, use 20 MHz xtal, bsd cable: avrdude -p t44 -c bsd -U lfuse:w:0x7E:m
   tiny 44, load hex file, bsd cable: avrdude -p t44 -c bsd -U flash:w:hello.echo.44.hex

---

</font></pre>
