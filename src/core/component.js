class Component {
  constructor(options = {}) {
    this.name = options.name;
    this.template = options.template || '';
    this.styles = options.styles || '';
    this.state = options.state || {};
    this.props = options.props || {};
    this.events = options.events || {};
  }

  // Lifecycle Methods
  beforeMount() {}
  mounted() {}
  beforeUpdate() {}
  updated() {}
  beforeUnmount() {}

  // Template Methods
  setTemplate(template) {
    this.template = template;
  }

  setStyles(styles) {
    this.styles = styles;
  }

  // State Management
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  getState() {
    return this.state;
  }

  setProps(newProps) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }

  getProps() {
    return this.props;
  }

  // Event Handling
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  // Rendering
  render() {
    const element = document.querySelector(`[data-component="${this.name}"]`);
    if (!element) return;

    this.beforeUpdate();
    
    // Add styles if not already added
    if (!document.getElementById(`${this.name}-styles`)) {
      const styleElement = document.createElement('style');
      styleElement.id = `${this.name}-styles`;
      styleElement.textContent = this.styles;
      document.head.appendChild(styleElement);
    }

    // Update content
    element.innerHTML = this.template;
    
    this.updated();
    this.mounted();
  }

  // Component Registration
  static register(name) {
    window.core.registerComponent(name, this);
  }
} 