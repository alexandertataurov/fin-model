# FinVision API Web Documentation

This directory contains web-based documentation for the FinVision API, providing multiple formats for different use cases.

## 📁 Files Overview

- **`landing.html`** - Main documentation hub with navigation to all formats
- **`index.html`** - ReDoc documentation (beautiful, responsive)
- **`swagger.html`** - Swagger UI (interactive testing)
- **`server.py`** - Local development server
- **`README.md`** - This file

## 🚀 Quick Start

### Option 1: Use the Local Server (Recommended)

1. **Start the server:**

   ```bash
   cd docs/redocs
   python server.py
   ```

2. **Open in browser:**
   - Landing page: http://localhost:8080/landing.html
   - ReDoc: http://localhost:8080/index.html
   - Swagger UI: http://localhost:8080/swagger.html

### Option 2: Open Directly in Browser

Simply open any of the HTML files directly in your browser:

- `landing.html` - Documentation hub
- `index.html` - ReDoc interface
- `swagger.html` - Swagger UI interface

## 📖 Documentation Formats

### 1. Landing Page (`landing.html`)

- **Purpose**: Overview and navigation hub
- **Features**:
  - API feature overview
  - Links to all documentation formats
  - Beautiful, responsive design
  - Quick access to all resources

### 2. ReDoc (`index.html`)

- **Purpose**: Beautiful, responsive API documentation
- **Features**:
  - Clean, modern interface
  - Responsive design for all devices
  - Search functionality
  - Code examples
  - Schema documentation
  - No interactive testing

### 3. Swagger UI (`swagger.html`)

- **Purpose**: Interactive API testing and documentation
- **Features**:
  - Interactive endpoint testing
  - Request/response examples
  - Authentication support
  - Try-it-out functionality
  - Real-time validation
  - Code generation

## 🛠️ Development

### Customizing the Documentation

#### ReDoc Customization

Edit `index.html` to modify:

- Colors and theme
- Header content
- Navigation links
- ReDoc configuration options

#### Swagger UI Customization

Edit `swagger.html` to modify:

- UI configuration
- Authentication setup
- Request/response interceptors
- Custom styling

#### Landing Page Customization

Edit `landing.html` to modify:

- Content and features
- Links and navigation
- Styling and layout
- Footer information

### Adding New Documentation Formats

1. Create your HTML file
2. Add it to the navigation in `landing.html`
3. Update the server script if needed
4. Test locally

## 🔧 Server Configuration

### Custom Port

```bash
python server.py --port 9000
```

### Features

- CORS headers for local development
- Proper MIME type handling
- Error handling
- Graceful shutdown

## 📱 Responsive Design

All documentation pages are fully responsive and work on:

- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes

## 🎨 Styling

The documentation uses:

- **Fonts**: Montserrat (headings), Roboto (body)
- **Colors**: Purple gradient theme (#667eea to #764ba2)
- **Icons**: Emoji icons for visual appeal
- **Layout**: CSS Grid and Flexbox for modern layouts

## 🔗 External Dependencies

### CDN Resources

- **ReDoc**: `https://cdn.jsdelivr.net/npm/redoc@2.1.3/`
- **Swagger UI**: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/`
- **Google Fonts**: Montserrat and Roboto

### Local Files

- **OpenAPI Spec**: `../openapi.yaml`
- **Postman Collection**: `../FinVision_API.postman_collection.json`
- **Markdown Docs**: `../API_DOCUMENTATION.md`

## 🚀 Deployment

### Static Hosting

These files can be deployed to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

### Requirements

- Web server with proper MIME type support
- CORS configuration (if needed)
- HTTPS (recommended for production)

## 🔍 Troubleshooting

### Common Issues

1. **OpenAPI spec not loading**

   - Check file path in HTML files
   - Ensure `openapi.yaml` exists in parent directory
   - Verify YAML syntax

2. **CORS errors**

   - Use the provided server script
   - Check browser console for errors
   - Verify file paths

3. **Styling issues**
   - Check internet connection (for CDN resources)
   - Clear browser cache
   - Verify CSS file paths

### Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📞 Support

For issues with the documentation:

- Check the troubleshooting section
- Review browser console for errors
- Verify all files are present
- Contact: support@finvision.com

## 📄 License

This documentation is part of the FinVision project and follows the same license terms.

---

_Last updated: January 2024_
_Documentation Version: 1.0.0_
