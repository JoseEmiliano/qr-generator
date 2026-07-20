const express = require("express");
const QRCode = require("qrcode");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
let historial = [];

app.get("/", (req, res) => {
  res.send(`
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 20px; background: #f4f4f9; }
        textarea { width: 100%; max-width: 500px; height: 120px; font-size: 18px; padding: 15px; border-radius: 8px; border: 1px solid #ccc; }
        button { padding: 15px 30px; font-size: 18px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; margin-top: 10px; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        #charCount { font-weight: bold; margin-top: 5px; }
    </style>
    <h1>Generador QR - Depósito</h1>
    <form action="/qr" method="POST">
      <textarea name="texto" id="textoInput" required oninput="updateForm()" placeholder="Ingrese datos..."></textarea>
      <div id="charCount">Caracteres: 0</div>
      <input type="text" name="nombreArchivo" placeholder="Nombre archivo" style="padding:10px; width:300px; margin-top:10px;"><br>
      <button type="submit" id="submitBtn">Generar y Guardar</button>
    </form>
    
    <script>
        function updateForm() {
            const input = document.getElementById('textoInput');
            const btn = document.getElementById('submitBtn');
            const display = document.getElementById('charCount');
            const len = input.value.length;
            
            display.innerText = "Caracteres: " + len + " (Máximo: 800)";
            if (len > 800) {
                display.style.color = "red";
                btn.disabled = true;
                btn.innerText = "Demasiados caracteres";
            } else {
                display.style.color = "green";
                btn.disabled = false;
                btn.innerText = "Generar y Guardar";
            }
        }
    </script>
    
    <h3>Últimos generados:</h3>
    <table>${historial.map(h => `<tr><td>${h.nombre}</td><td>${h.texto}</td></tr>`).join('')}</table>
  `);
});

app.post("/qr", async (req, res) => {
  const { texto, nombreArchivo } = req.body;
  const nombreFinal = nombreArchivo || "etiqueta_qr";
  historial.unshift({ nombre: nombreFinal, texto });
  if (historial.length > 5) historial.pop();

  const qrData = await QRCode.toDataURL(texto, { margin: 1, width: 1000 });
  
  res.send(`
    <style>body { text-align: center; padding: 20px; font-family: sans-serif; } img { max-width: 400px; width: 100%; border: 2px solid #333; } .controls { margin-top: 20px; } button { padding: 12px 24px; font-size: 18px; margin: 5px; cursor: pointer; background: #28a745; color: white; border: none; } @media print { .controls, a, h2, p { display: none; } }</style>
    <h2>${nombreFinal}</h2>
    <img id="qrImage" src="${qrData}">
    <div class="controls">
        <button onclick="downloadQR('${nombreFinal}')">Descargar PNG</button>
        <button onclick="window.print()">Imprimir Etiqueta</button>
        <br><br><a href="/">Volver</a>
    </div>
    <script>
        function downloadQR(name) {
          const link = document.createElement('a');
          link.download = name + '.png';
          link.href = document.getElementById('qrImage').src;
          link.click();
        }
    </script>
  `);
});

app.listen(port, () => console.log("Servidor en http://localhost:3000"));
