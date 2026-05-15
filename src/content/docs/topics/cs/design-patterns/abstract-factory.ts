// Product interfaces
interface Button {
  render(): void;
  onClick(): void;
}

interface Checkbox {
  render(): void;
  toggle(): void;
}

// Abstract factory interface
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Light theme products
class LightButton implements Button {
  render(): void {
    console.log("Rendering light button: white background, dark border");
  }
  onClick(): void {
    console.log("Light button clicked");
  }
}

class LightCheckbox implements Checkbox {
  private checked = false;

  render(): void {
    console.log(`Rendering light checkbox: ${this.checked ? "checked" : "unchecked"}`);
  }
  toggle(): void {
    this.checked = !this.checked;
    console.log(`Light checkbox toggled to ${this.checked}`);
  }
}

// Dark theme products
class DarkButton implements Button {
  render(): void {
    console.log("Rendering dark button: dark background, light border");
  }
  onClick(): void {
    console.log("Dark button clicked");
  }
}

class DarkCheckbox implements Checkbox {
  private checked = false;

  render(): void {
    console.log(`Rendering dark checkbox: ${this.checked ? "checked" : "unchecked"}`);
  }
  toggle(): void {
    this.checked = !this.checked;
    console.log(`Dark checkbox toggled to ${this.checked}`);
  }
}

// Concrete factories
class LightFactory implements UIFactory {
  createButton(): Button {
    return new LightButton();
  }
  createCheckbox(): Checkbox {
    return new LightCheckbox();
  }
}

class DarkFactory implements UIFactory {
  createButton(): Button {
    return new DarkButton();
  }
  createCheckbox(): Checkbox {
    return new DarkCheckbox();
  }
}

// Client -- knows nothing about concrete classes
function renderSettingsPanel(factory: UIFactory): void {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();

  button.render();
  checkbox.render();
  checkbox.toggle();
  button.onClick();
}

// Usage
const theme = process.env.THEME === "dark" ? new DarkFactory() : new LightFactory();
renderSettingsPanel(theme);
