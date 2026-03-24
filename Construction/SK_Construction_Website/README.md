# SK Construction Website

## Fixing the browser console error (file:// origin)

If you open `index.html` by double-clicking it, the browser loads it as a `file://` URL. Modern browsers treat `file:` pages as **unique security origins**, so navigation inside previews/iframes can trigger errors like:

> `Unsafe attempt to load URL file:///... 'file:' URLs are treated as unique security origins`

Run the site from a local web server instead (recommended):

### Option A: PowerShell (included)

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open:

- `http://localhost:5500/index.html`

### Option B: VS Code “Live Server”

Install the **Live Server** extension and click **Go Live**.

