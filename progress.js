const svgns = "http://www.w3.org/2000/svg";

const invoke = (fn) => fn();

class CircularProgress {
  /**
   *
   * @param {HTMLElement} elem
   * @param {{
   *  size: number,
   *  thickness: number,
   *  primaryColor: string,
   *  secondaryColor: string,
   * }} options
   */
  constructor(elem, options) {
    if (!elem) throw new Error("Missing circular progress elem parameter.");
    const fallback = {
      size: 120,
      thickness: 10,
      secondaryColor: "#f0f0f0",
      primaryColor: "blue",
    };
    options = Object.assign(fallback, options);
    const { size, thickness, secondaryColor, primaryColor } = options;
    const radius = size / 2;
    const normalizedRadius = radius - thickness * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const secondaryCircle = document.createElementNS(svgns, "circle");
    secondaryCircle.setAttribute("stroke", secondaryColor);
    secondaryCircle.setAttribute("stroke-width", thickness);
    secondaryCircle.setAttribute("fill", "transparent");
    secondaryCircle.setAttribute("r", normalizedRadius);
    secondaryCircle.setAttribute("cx", radius);
    secondaryCircle.setAttribute("cy", radius);
    const primaryCircle = secondaryCircle.cloneNode();
    primaryCircle.setAttribute("stroke", primaryColor);
    primaryCircle.setAttribute("stroke-dasharray", circumference);
    primaryCircle.classList.add("circular-progress__primary-circle");
    const svg = document.createElementNS(svgns, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    elem.setAttribute("role", "progressbar");

    const updateProgress = this._updateProgress.bind(this);
    const toggleAnimation = this._toggleAnimation.bind(this);
    const toggleVisibility = this._toggleVisibility.bind(this);

    this._circumference = circumference;
    this._primaryCircle = primaryCircle;
    this._elem = elem;
    this._isAnimated = false;
    this._isHidden = false;
    this._deps = {
      value: [updateProgress],
      isAnimated: [updateProgress, toggleAnimation],
      isHidden: [toggleVisibility],
    };

    this.value = 0;
    svg.append(secondaryCircle, primaryCircle);
    elem.append(svg);
  }

  /**
   * Progress value from 0 to 100.
   * @type {number}
   */
  get value() {
    return this._value;
  }

  set value(value) {
    value = Math.min(Math.max(value, 0), 100);
    if (this._value === value) return;
    this._value = value;
    this._deps.value.forEach(invoke);
  }

  /**
   * Turn on/off progress animation.
   * @type {boolean}
   */
  get isAnimated() {
    return this._isAnimated;
  }

  set isAnimated(value) {
    if (this._isAnimated === value) return;
    this._isAnimated = value;
    this._deps.isAnimated.forEach(invoke);
  }

  /**
   * Turn on/off progress visibility.
   * @type {boolean}
   */
  get isHidden() {
    return this._isHidden;
  }

  set isHidden(value) {
    if (this._isHidden === value) return;
    this._isHidden = value;
    this._deps.isHidden.forEach(invoke);
  }

  _updateProgress() {
    let percentage;
    if (this.isAnimated) {
      percentage = 75;
      this._elem.removeAttribute("aria-valuenow");
    } else {
      percentage = this.value;
      this._elem.setAttribute("aria-valuenow", percentage);
    }
    const circumference = this._circumference;
    const offset = circumference - (percentage / 100) * circumference;
    this._primaryCircle.style.strokeDashoffset = offset;
  }

  _toggleAnimation() {
    const cls = "circular-progress-animation";
    this._primaryCircle.classList.toggle(cls);
  }

  _toggleVisibility() {
    this._elem.style.visibility = this.isHidden ? "hidden" : "visible";
  }
}
