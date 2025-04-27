# Health Pages Styling

This directory contains the CSS styling for the health-related pages in the Mindful Health Hub application.

## Files

- `main.css` - Main CSS file that imports all other styles
- `healthPages.css` - Styles specific to health pages (Symptom Checker, AI Summary, Personalized Insights)

## Theme Customization

You can customize the theme by modifying the CSS variables in `healthPages.css`. The main colors are:

```css
:root {
  --primary: #2D7DD2;        /* Main brand color */
  --primary-light: #45B7EE;  /* Lighter shade of primary */
  --primary-dark: #215F9E;   /* Darker shade of primary */
  --secondary: #45A29E;      /* Secondary color */
  --accent: #FF6B6B;         /* Accent color for highlights */
  --success: #4CAF50;        /* Success indicators */
  --warning: #FFC107;        /* Warning indicators */
  --danger: #EF476F;         /* Danger/error indicators */
}
```

## Component Classes

The CSS provides several utility classes:

- `.text-gradient-primary` - Gradient text effect for headings
- `.bg-gradient-primary` - Gradient background 
- `.health-card` - Card component styling
- `.btn-primary` and `.btn-secondary` - Button styles
- `.health-tag` - Tags and badges styling

## Animations

Custom animations included:

- `.animate-fadeIn` - Fade in animation
- `.animate-slideDown` - Slide down animation
- `.animate-pulse` - Pulsing effect for loading states

## Dark Mode Support

The CSS includes a dark theme that can be toggled by adding the `.dark-theme` class to the root element:

```javascript
// Example toggle function
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark-theme');
}
``` 