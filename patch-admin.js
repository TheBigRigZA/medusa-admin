const fs = require("fs");
const path = require("path");

////////////////////////////// utils /////////////////////////////

const findFileInAssets = (filePattern, fileExtension = ".js") => {
  const dirPath = path.join(__dirname, "assets");

  if (!fs.existsSync(dirPath)) {
    throw new Error(`Assets directory not found: ${dirPath}`);
  }

  // Read the list of files in the directory
  const files = fs.readdirSync(dirPath);

  // Find the first file that matches the pattern
  const fileName = files.find(
    (file) => file.startsWith(filePattern) && file.endsWith(fileExtension)
  );

  if (!fileName) {
    throw new Error(`No file found matching pattern: ${filePattern}`);
  }

  const filePath = path.join(dirPath, fileName);
  return filePath;
};

function findAssetFileByContainingText(text) {
  try {
    const dirPath = path.join(__dirname, "assets");

    // Read the list of files in the directory
    const files = fs.readdirSync(dirPath);

    // Filter out JavaScript files
    const targetFiles = files.filter(
      (file) => file.endsWith(".js")
    );

    // Loop over the matching files and check their content
    for (const fileName of targetFiles) {
      const filePath = path.join(dirPath, fileName);
      const content = fs.readFileSync(filePath, "utf8");

      // If the file contains the target string, return the path
      if (content.includes(text)) {
        console.log(`Found '${text}' in file: ${filePath}`);
        return filePath;
      }
    }
    
    console.log(`Text '${text}' not found in any asset files`);
    return null;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

const readFileAsLines = (filePath) => {
  // Read the file content
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Split the file into lines
  const lines = fileContent.split("\n");

  return lines;
};

const writeFile = (content, filePath) => {
  // Write the modified content back to the file
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✓ Updated ${path.basename(filePath)} successfully.`);
};

// Helper function to convert image to base64
const imageToBase64 = (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    const extension = path.extname(imagePath).substring(1);
    return `data:image/${extension};base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting image to base64: ${error}`);
    return null;
  }
};

////////////////////////////// customizations /////////////////////////////

console.log("🎨 Applying Mediabox branding customizations to static build...");
console.log("Working directory:", __dirname);

try {
  // 1) Welcome to Medusa -> Welcome to The Mediabox Global Ecommerce Store Admin Portal
  console.log("\n1. Searching for welcome text...");
  const welcomeFile = findAssetFileByContainingText("Welcome to Medusa");
  if (welcomeFile) {
    let content = fs.readFileSync(welcomeFile, 'utf8');
    const originalContent = content;
    
    content = content.replace(/Welcome to Medusa/g, "Welcome to The Mediabox Global Ecommerce Store Admin Portal");
    
    if (content !== originalContent) {
      writeFile(content, welcomeFile);
      console.log(`✓ Updated welcome text in ${path.basename(welcomeFile)}`);
    } else {
      console.log("⚠️  Welcome text not found or already updated");
    }
  } else {
    console.log("⚠️  Could not find file containing 'Welcome to Medusa'");
  }

  // 2) Update login page logo
  console.log("\n2. Updating login page logo...");
  try {
    const loginFile = findFileInAssets("login-");
    console.log("Found login file:", path.basename(loginFile));
    
    const loginLogoBase64 = imageToBase64(path.join(__dirname, 'assets', 'logo-login.png'));
    
    if (loginLogoBase64) {
      console.log("✓ Logo converted to base64");
      let content = fs.readFileSync(loginFile, 'utf8');
      const originalContent = content;
      
      // Create a custom logo component that we'll inject
      const customLogoComponent = `jsx14("div",{className:"flex justify-center mb-6",children:jsx14("img",{src:"${loginLogoBase64}",alt:"Mediabox",className:"h-20 w-auto"})})`;
      
      // Pattern 1: Replace AvatarBox components
      content = content.replace(/jsx\d*\(AvatarBox[^)]*\)/g, customLogoComponent);
      
      // Pattern 2: Replace LogoBox components  
      content = content.replace(/jsx\d*\(LogoBox[^)]*\)/g, customLogoComponent);
      
      // Pattern 3: Replace any div with avatar-related classes
      content = content.replace(
        /jsx\d*\("div",\s*{\s*className:\s*"[^"]*(?:avatar|logo)[^"]*"[^}]*}\)/g, 
        customLogoComponent
      );
      
      // Pattern 4: Look for specific Medusa logo references
      content = content.replace(/jsx\d*\([^,]*MedusaLogo[^)]*\)/g, customLogoComponent);
      
      // Pattern 5: Replace svg elements that might be logos (40x40 is typical Medusa logo size)
      content = content.replace(
        /jsx\d*\("svg",\s*{[^}]*(?:width:\s*"?40"?|height:\s*"?40"?)[^}]*}\)/g,
        customLogoComponent
      );
      
      if (content !== originalContent) {
        writeFile(content, loginFile);
        console.log("✓ Updated login page logo");
      } else {
        console.log("⚠️  No logo patterns found in login page, trying CSS injection...");
        
        // Inject CSS to override default logo
        if (!content.includes('mediabox-login-styles')) {
          const cssInjection = `
// Inject Mediabox login styles
if (typeof document !== 'undefined' && !document.getElementById('mediabox-login-styles')) {
  const style = document.createElement('style');
  style.id = 'mediabox-login-styles';
  style.innerHTML = \`
    /* Hide default Medusa logo */
    [class*="avatar"], [class*="logo"], svg[width="40"], svg[height="40"] {
      display: none !important;
    }
    
    /* Add Mediabox logo */
    form::before, .login-container::before {
      content: '';
      display: block;
      width: 200px;
      height: 80px;
      margin: 0 auto 2rem;
      background-image: url('${loginLogoBase64}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  \`;
  document.head.appendChild(style);
}
`;
          content = cssInjection + '\n' + content;
          writeFile(content, loginFile);
          console.log("✓ Injected CSS for login page branding");
        }
      }
    } else {
      console.log("❌ Failed to convert logo to base64");
    }
  } catch (error) {
    console.log("❌ Error updating login page:", error.message);
  }

  // 3) Update reset password page logo
  console.log("\n3. Updating reset password page logo...");
  try {
    const resetPasswordFile = findFileInAssets("reset-password-");
    const loginLogoBase64 = imageToBase64(path.join(__dirname, 'assets', 'logo-login.png'));
    
    if (loginLogoBase64) {
      let content = fs.readFileSync(resetPasswordFile, 'utf8');
      const originalContent = content;
      
      const customLogoComponent = `jsx14("div",{className:"flex justify-center mb-6",children:jsx14("img",{src:"${loginLogoBase64}",alt:"Mediabox",className:"h-16 w-auto"})})`;
      
      content = content.replace(/jsx\d*\(LogoBox[^)]*\)/g, customLogoComponent);
      content = content.replace(/jsx\d*\([^,]*MedusaLogo[^)]*\)/g, customLogoComponent);
      
      if (content !== originalContent) {
        writeFile(content, resetPasswordFile);
        console.log("✓ Updated reset password page logo");
      }
    }
  } catch (error) {
    console.log("❌ Error updating reset password page:", error.message);
  }

  // 4) Update index.html with global styles and favicon
  console.log("\n4. Updating index.html with global branding...");
  const indexPath = path.join(__dirname, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let modified = false;
    
    // Update favicon reference
    if (!indexContent.includes('favicon.ico')) {
      indexContent = indexContent.replace(
        /<link rel="icon"[^>]*>/g,
        '<link rel="icon" type="image/x-icon" href="/app/assets/favicon.ico">'
      );
      modified = true;
    }
    
    // Inject global Mediabox styles if not already present
    if (!indexContent.includes('mediabox-global-styles')) {
      const loginLogoBase64 = imageToBase64(path.join(__dirname, 'assets', 'logo-login.png'));
      const headerLogoBase64 = imageToBase64(path.join(__dirname, 'assets', 'logo-header.png'));
      
      const globalStyles = `
    <style id="mediabox-global-styles">
      :root {
        --mediabox-primary: #df3d58;
        --mediabox-secondary: #d74e2f;
        --mediabox-hover: #c23450;
      }
      
      /* Hide all default Medusa logos */
      [class*="avatar"]:not(.user-avatar), 
      [class*="logo"]:not(.mediabox-logo),
      svg[width="40"][height="40"],
      .medusa-logo {
        display: none !important;
      }
      
      /* Login page logo */
      form::before, .login-container::before {
        content: '';
        display: block;
        width: 200px;
        height: 80px;
        margin: 0 auto 2rem;
        background-image: url('${loginLogoBase64}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      
      /* Header logo replacement */
      nav [class*="logo"]::after,
      header [class*="logo"]::after {
        content: '';
        display: block;
        width: 150px;
        height: 40px;
        background-image: url('${headerLogoBase64}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center left;
      }
      
      /* Update primary buttons and interactive elements */
      .bg-ui-button-inverted, 
      .bg-ui-button-inverted-hover:hover,
      button[type="submit"],
      [class*="bg-ui-button-inverted"] {
        background-color: var(--mediabox-primary) !important;
      }
      
      .bg-ui-button-inverted:hover {
        background-color: var(--mediabox-hover) !important;
      }
      
      /* Update primary text colors and links */
      .text-ui-fg-interactive,
      a[class*="text-ui-fg-interactive"],
      [class*="text-ui-fg-interactive"] {
        color: var(--mediabox-primary) !important;
      }
      
      /* Update focus states */
      input:focus,
      button:focus,
      select:focus,
      textarea:focus,
      .focus\\:shadow-borders-interactive-with-focus:focus,
      [class*="focus:shadow-borders-interactive"]:focus {
        box-shadow: 0 0 0 2px var(--mediabox-primary) !important;
        border-color: var(--mediabox-primary) !important;
      }
      
      /* Update active and selected states */
      .bg-ui-bg-interactive,
      [class*="bg-ui-bg-interactive"] {
        background-color: var(--mediabox-primary) !important;
      }
      
      /* Update progress bars and loading indicators - but preserve status indicators */
      .progress-bar {
        background-color: var(--mediabox-primary) !important;
      }
      
      /* Preserve green status indicators for product/service status */
      .bg-ui-tag-green-icon,
      [class*="bg-ui-tag-green-icon"],
      .status-indicator.green,
      [class*="status-green"],
      [class*="live-status"],
      [class*="active-status"] {
        background-color: #10b981 !important; /* Keep original green for status */
      }
      
      /* Preserve other semantic green colors for status/success states */
      .bg-green-500,
      .bg-emerald-500,
      [class*="success"],
      [class*="bg-ui-tag-green"]:not([class*="button"]):not([class*="interactive"]) {
        background-color: #10b981 !important;
      }
      
      /* Update checkboxes and radio buttons */
      input[type="checkbox"]:checked,
      input[type="radio"]:checked {
        background-color: var(--mediabox-primary) !important;
        border-color: var(--mediabox-primary) !important;
      }
    </style>`;
      
      // Insert styles before closing head tag
      indexContent = indexContent.replace('</head>', globalStyles + '\n</head>');
      modified = true;
    }
    
    if (modified) {
      writeFile(indexContent, indexPath);
      console.log("✓ Updated index.html with global branding");
    } else {
      console.log("✓ index.html already contains branding");
    }
  }

  console.log("\n✅ Mediabox branding customizations applied successfully!");
  console.log("\n📋 Summary of changes:");
  console.log("   • Welcome text updated to Mediabox branding");
  console.log("   • Login page logo replaced with Mediabox logo");
  console.log("   • Reset password page logo updated");
  console.log("   • Global CSS styles applied for consistent branding");
  console.log("   • Favicon reference updated");
  console.log("   • Primary color scheme changed to Mediabox colors (#df3d58)");

} catch (error) {
  console.error("❌ Error applying customizations:", error);
  process.exit(1);
}