# Hello. — [Electronics Production (2013)](../../../../../years/2013/Web/classes/electronics_production/index.html)

---

<pre><font face="bitstream vera sans,arial,helvetica,sans-serif">

<a href="https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.components.png"><img src="https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.components.png" width="220" style="float:right; margin-left:20px;"></a>
<b>assignment</b>
   make the FabISP in-circuit programmer
      <a href=http://fab.cba.mit.edu/content/projects/fabisp/>David</a> <a href=http://fab.cba.mit.edu/content/projects/fabispkey/index.html>Andy</a> <a href=http://fab.cba.mit.edu/classes/863.11/people/valentin.heun/2.htm>Valentin</a>
      <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-years/2012/Web/classes/embedded_programming/hello.ISP.44.cad>hello.ISP.44.cad</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.png>board</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.components.png>components</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-years/2012/Web/classes/embedded_programming/hello.ISP.44.traces.png>traces</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.interior.png>interior</a>
         <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-years/2012/Web/classes/embedded_programming/hello.ISP.44.res.cad>hello.ISP.44.res.cad</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.res.png>board</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/hello.ISP.44.res.traces.png>traces</a> <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-years/2012/Web/classes/embedded_programming/hello.ISP.44.res.interior.png>interior</a>
      <a href=http://fab.cba.mit.edu/about/fab/inv.html>inventory</a> <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?Detail&name=ATTINY44A-SSU-ND>microcontroller</a> <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?Detail&name=644-1039-1-ND>crystal</a> <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?Detail&name=H2961CT-ND>USB connector</a> <a href=http://www.mouser.com/ProductDetail/FCI/71600-006LF/?qs=yJYkLTYh5760qKJxwPD6hA%3d%3d>ribbon connector</a> <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?Detail&name=BZT52C3V3-FDICT-ND>Zener diode</a> <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?Detail&name=311-0.0ERCT-ND>jumper</a>
      <a href=https://raw.githubusercontent.com/FabLabReykjavik/FabAcademyArchiveAssets/main/classes-master/embedded_programming/firmware.zip>firmware.zip</a>
         USB power
         make clean
         make hex
         (sudo) make fuse (check <a href=http://search.digikey.com/scripts/DkSearch/dksus.dll?lang=en&site=US&KeyWords=avrisp2&x=0&y=0>programmer</a> in Makefile, may need to repeat)
         (sudo) make program
         desolder SJ1 and SJ2
         make IDC ISP cable, connecting header pin 1 to pin 1

---

</font></pre>
