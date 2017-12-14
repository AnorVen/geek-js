/*! jQRangeSlider 5.7.2 - 2016-01-18 - Copyright (C) Guillaume Gautreau 2012 - MIT and GPLv3 licenses.*/
!function (a, b) {
  "use strict";
  a.widget("ui.rangeSliderMouseTouch", a.ui.mouse, {
    enabled: !0, _mouseInit: function () {
      var b = this;
      a.ui.mouse.prototype._mouseInit.apply(this), this._mouseDownEvent = !1, this.element.bind("touchstart." + this.widgetName, function (a) {
        return b._touchStart(a)
      })
    }, _mouseDestroy: function () {
      a(document).unbind("touchmove." + this.widgetName, this._touchMoveDelegate).unbind("touchend." + this.widgetName, this._touchEndDelegate), a.ui.mouse.prototype._mouseDestroy.apply(this)
    }, enable: function () {
      this.enabled = !0
    }, disable: function () {
      this.enabled = !1
    }, destroy: function () {
      this._mouseDestroy(), a.ui.mouse.prototype.destroy.apply(this), this._mouseInit = null
    }, _touchStart: function (b) {
      if (!this.enabled)return !1;
      b.which = 1, b.preventDefault(), this._fillTouchEvent(b);
      var c = this, d = this._mouseDownEvent;
      this._mouseDown(b), d !== this._mouseDownEvent && (this._touchEndDelegate = function (a) {
        c._touchEnd(a)
      }, this._touchMoveDelegate = function (a) {
        c._touchMove(a)
      }, a(document).bind("touchmove." + this.widgetName, this._touchMoveDelegate).bind("touchend." + this.widgetName, this._touchEndDelegate))
    }, _mouseDown: function (b) {
      return this.enabled ? a.ui.mouse.prototype._mouseDown.apply(this, [b]) : !1
    }, _touchEnd: function (b) {
      this._fillTouchEvent(b), this._mouseUp(b), a(document).unbind("touchmove." + this.widgetName, this._touchMoveDelegate).unbind("touchend." + this.widgetName, this._touchEndDelegate), this._mouseDownEvent = !1, a(document).trigger("mouseup")
    }, _touchMove: function (a) {
      return a.preventDefault(), this._fillTouchEvent(a), this._mouseMove(a)
    }, _fillTouchEvent: function (a) {
      var b;
      b = "undefined" == typeof a.targetTouches && "undefined" == typeof a.changedTouches ? a.originalEvent.targetTouches[0] || a.originalEvent.changedTouches[0] : a.targetTouches[0] || a.changedTouches[0], a.pageX = b.pageX, a.pageY = b.pageY, a.which = 1
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.rangeSliderDraggable", a.ui.rangeSliderMouseTouch, {
    cache: null,
    options: {containment: null},
    _create: function () {
      a.ui.rangeSliderMouseTouch.prototype._create.apply(this), setTimeout(a.proxy(this._initElementIfNotDestroyed, this), 10)
    },
    destroy: function () {
      this.cache = null, a.ui.rangeSliderMouseTouch.prototype.destroy.apply(this)
    },
    _initElementIfNotDestroyed: function () {
      this._mouseInit && this._initElement()
    },
    _initElement: function () {
      this._mouseInit(), this._cache()
    },
    _setOption: function (b, c) {
      "containment" === b && (null === c || 0 === a(c).length ? this.options.containment = null : this.options.containment = a(c))
    },
    _mouseStart: function (a) {
      return this._cache(), this.cache.click = {
        left: a.pageX,
        top: a.pageY
      }, this.cache.initialOffset = this.element.offset(), this._triggerMouseEvent("mousestart"), !0
    },
    _mouseDrag: function (a) {
      var b = a.pageX - this.cache.click.left;
      return b = this._constraintPosition(b + this.cache.initialOffset.left), this._applyPosition(b), this._triggerMouseEvent("sliderDrag"), !1
    },
    _mouseStop: function () {
      this._triggerMouseEvent("stop")
    },
    _constraintPosition: function (a) {
      return 0 !== this.element.parent().length && null !== this.cache.parent.offset && (a = Math.min(a, this.cache.parent.offset.left + this.cache.parent.width - this.cache.width.outer), a = Math.max(a, this.cache.parent.offset.left)), a
    },
    _applyPosition: function (a) {
      this._cacheIfNecessary();
      var b = {top: this.cache.offset.top, left: a};
      this.element.offset({left: a}), this.cache.offset = b
    },
    _cacheIfNecessary: function () {
      null === this.cache && this._cache()
    },
    _cache: function () {
      this.cache = {}, this._cacheMargins(), this._cacheParent(), this._cacheDimensions(), this.cache.offset = this.element.offset()
    },
    _cacheMargins: function () {
      this.cache.margin = {
        left: this._parsePixels(this.element, "marginLeft"),
        right: this._parsePixels(this.element, "marginRight"),
        top: this._parsePixels(this.element, "marginTop"),
        bottom: this._parsePixels(this.element, "marginBottom")
      }
    },
    _cacheParent: function () {
      if (null !== this.options.parent) {
        var a = this.element.parent();
        this.cache.parent = {offset: a.offset(), width: a.width()}
      } else this.cache.parent = null
    },
    _cacheDimensions: function () {
      this.cache.width = {outer: this.element.outerWidth(), inner: this.element.width()}
    },
    _parsePixels: function (a, b) {
      return parseInt(a.css(b), 10) || 0
    },
    _triggerMouseEvent: function (a) {
      var b = this._prepareEventData();
      this.element.trigger(a, b)
    },
    _prepareEventData: function () {
      return {element: this.element, offset: this.cache.offset || null}
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.rangeSlider", {
    options: {
      bounds: {min: 0, max: 100},
      defaultValues: {min: 20, max: 50},
      wheelMode: null,
      wheelSpeed: 4,
      arrows: !0,
      valueLabels: "show",
      formatter: null,
      durationIn: 0,
      durationOut: 400,
      delayOut: 200,
      range: {min: !1, max: !1},
      step: !1,
      scales: !1,
      enabled: !0,
      symmetricPositionning: !1
    },
    _values: null,
    _valuesChanged: !1,
    _initialized: !1,
    bar: null,
    leftHandle: null,
    rightHandle: null,
    innerBar: null,
    container: null,
    arrows: null,
    labels: null,
    changing: {min: !1, max: !1},
    changed: {min: !1, max: !1},
    ruler: null,
    _create: function () {
      this._setDefaultValues(), this.labels = {
        left: null,
        right: null,
        leftDisplayed: !0,
        rightDisplayed: !0
      }, this.arrows = {left: null, right: null}, this.changing = {min: !1, max: !1}, this.changed = {
        min: !1,
        max: !1
      }, this._createElements(), this._bindResize(), setTimeout(a.proxy(this.resize, this), 1), setTimeout(a.proxy(this._initValues, this), 1)
    },
    _setDefaultValues: function () {
      this._values = {min: this.options.defaultValues.min, max: this.options.defaultValues.max}
    },
    _bindResize: function () {
      var b = this;
      this._resizeProxy = function (a) {
        b.resize(a)
      }, a(window).resize(this._resizeProxy)
    },
    _initWidth: function () {
      this.container.css("width", this.element.width() - this.container.outerWidth(!0) + this.container.width()), this.innerBar.css("width", this.container.width() - this.innerBar.outerWidth(!0) + this.innerBar.width())
    },
    _initValues: function () {
      this._initialized = !0, this.values(this._values.min, this._values.max)
    },
    _setOption: function (a, b) {
      this._setWheelOption(a, b), this._setArrowsOption(a, b), this._setLabelsOption(a, b), this._setLabelsDurations(a, b), this._setFormatterOption(a, b), this._setBoundsOption(a, b), this._setRangeOption(a, b), this._setStepOption(a, b), this._setScalesOption(a, b), this._setEnabledOption(a, b), this._setPositionningOption(a, b)
    },
    _validProperty: function (a, b, c) {
      return null === a || "undefined" == typeof a[b] ? c : a[b]
    },
    _setStepOption: function (a, b) {
      "step" === a && (this.options.step = b, this._leftHandle("option", "step", b), this._rightHandle("option", "step", b), this._changed(!0))
    },
    _setScalesOption: function (a, b) {
      "scales" === a && (b === !1 || null === b ? (this.options.scales = !1, this._destroyRuler()) : b instanceof Array && (this.options.scales = b, this._updateRuler()))
    },
    _setRangeOption: function (a, b) {
      "range" === a && (this._bar("option", "range", b), this.options.range = this._bar("option", "range"), this._changed(!0))
    },
    _setBoundsOption: function (a, b) {
      "bounds" === a && "undefined" != typeof b.min && "undefined" != typeof b.max && this.bounds(b.min, b.max)
    },
    _setWheelOption: function (a, b) {
      ("wheelMode" === a || "wheelSpeed" === a) && (this._bar("option", a, b), this.options[a] = this._bar("option", a))
    },
    _setLabelsOption: function (a, b) {
      if ("valueLabels" === a) {
        if ("hide" !== b && "show" !== b && "change" !== b)return;
        this.options.valueLabels = b, "hide" !== b ? (this._createLabels(), this._leftLabel("update"), this._rightLabel("update")) : this._destroyLabels()
      }
    },
    _setFormatterOption: function (a, b) {
      "formatter" === a && null !== b && "function" == typeof b && "hide" !== this.options.valueLabels && (this._leftLabel("option", "formatter", b), this.options.formatter = this._rightLabel("option", "formatter", b))
    },
    _setArrowsOption: function (a, b) {
      "arrows" !== a || b !== !0 && b !== !1 || b === this.options.arrows || (b === !0 ? (this.element.removeClass("ui-rangeSlider-noArrow").addClass("ui-rangeSlider-withArrows"), this.arrows.left.css("display", "block"), this.arrows.right.css("display", "block"), this.options.arrows = !0) : b === !1 && (this.element.addClass("ui-rangeSlider-noArrow").removeClass("ui-rangeSlider-withArrows"), this.arrows.left.css("display", "none"), this.arrows.right.css("display", "none"), this.options.arrows = !1), this._initWidth())
    },
    _setLabelsDurations: function (a, b) {
      if ("durationIn" === a || "durationOut" === a || "delayOut" === a) {
        if (parseInt(b, 10) !== b)return;
        null !== this.labels.left && this._leftLabel("option", a, b), null !== this.labels.right && this._rightLabel("option", a, b), this.options[a] = b
      }
    },
    _setEnabledOption: function (a, b) {
      "enabled" === a && this.toggle(b)
    },
    _setPositionningOption: function (a, b) {
      "symmetricPositionning" === a && (this._rightHandle("option", a, b), this.options[a] = this._leftHandle("option", a, b))
    },
    _createElements: function () {
      "absolute" !== this.element.css("position") && this.element.css("position", "relative"), this.element.addClass("ui-rangeSlider"), this.container = a("<div class='ui-rangeSlider-container' />").css("position", "absolute").appendTo(this.element), this.innerBar = a("<div class='ui-rangeSlider-innerBar' />").css("position", "absolute").css("top", 0).css("left", 0), this._createHandles(), this._createBar(), this.container.prepend(this.innerBar), this._createArrows(), "hide" !== this.options.valueLabels ? this._createLabels() : this._destroyLabels(), this._updateRuler(), this.options.enabled || this._toggle(this.options.enabled)
    },
    _createHandle: function (b) {
      return a("<div />")[this._handleType()](b).bind("sliderDrag", a.proxy(this._changing, this)).bind("stop", a.proxy(this._changed, this))
    },
    _createHandles: function () {
      this.leftHandle = this._createHandle({
        isLeft: !0,
        bounds: this.options.bounds,
        value: this._values.min,
        step: this.options.step,
        symmetricPositionning: this.options.symmetricPositionning
      }).appendTo(this.container), this.rightHandle = this._createHandle({
        isLeft: !1,
        bounds: this.options.bounds,
        value: this._values.max,
        step: this.options.step,
        symmetricPositionning: this.options.symmetricPositionning
      }).appendTo(this.container)
    },
    _createBar: function () {
      this.bar = a("<div />").prependTo(this.container).bind("sliderDrag scroll zoom", a.proxy(this._changing, this)).bind("stop", a.proxy(this._changed, this)), this._bar({
        leftHandle: this.leftHandle,
        rightHandle: this.rightHandle,
        values: {min: this._values.min, max: this._values.max},
        type: this._handleType(),
        range: this.options.range,
        wheelMode: this.options.wheelMode,
        wheelSpeed: this.options.wheelSpeed
      }), this.options.range = this._bar("option", "range"), this.options.wheelMode = this._bar("option", "wheelMode"), this.options.wheelSpeed = this._bar("option", "wheelSpeed")
    },
    _createArrows: function () {
      this.arrows.left = this._createArrow("left"), this.arrows.right = this._createArrow("right"), this.options.arrows ? this.element.addClass("ui-rangeSlider-withArrows") : (this.arrows.left.css("display", "none"), this.arrows.right.css("display", "none"), this.element.addClass("ui-rangeSlider-noArrow"))
    },
    _createArrow: function (b) {
      var c,
        d = a("<div class='ui-rangeSlider-arrow' />").append("<div class='ui-rangeSlider-arrow-inner' />").addClass("ui-rangeSlider-" + b + "Arrow").css("position", "absolute").css(b, 0).appendTo(this.element);
      return c = "right" === b ? a.proxy(this._scrollRightClick, this) : a.proxy(this._scrollLeftClick, this), d.bind("mousedown touchstart", c), d
    },
    _proxy: function (a, b, c) {
      var d = Array.prototype.slice.call(c);
      return a && a[b] ? a[b].apply(a, d) : null
    },
    _handleType: function () {
      return "rangeSliderHandle"
    },
    _barType: function () {
      return "rangeSliderBar"
    },
    _bar: function () {
      return this._proxy(this.bar, this._barType(), arguments)
    },
    _labelType: function () {
      return "rangeSliderLabel"
    },
    _leftLabel: function () {
      return this._proxy(this.labels.left, this._labelType(), arguments)
    },
    _rightLabel: function () {
      return this._proxy(this.labels.right, this._labelType(), arguments)
    },
    _leftHandle: function () {
      return this._proxy(this.leftHandle, this._handleType(), arguments)
    },
    _rightHandle: function () {
      return this._proxy(this.rightHandle, this._handleType(), arguments)
    },
    _getValue: function (a, b) {
      return b === this.rightHandle && (a -= b.outerWidth()), a * (this.options.bounds.max - this.options.bounds.min) / (this.container.innerWidth() - b.outerWidth(!0)) + this.options.bounds.min
    },
    _trigger: function (a) {
      var b = this;
      setTimeout(function () {
        b.element.trigger(a, {label: b.element, values: b.values()})
      }, 1)
    },
    _changing: function () {
      this._updateValues() && (this._trigger("valuesChanging"), this._valuesChanged = !0)
    },
    _deactivateLabels: function () {
      "change" === this.options.valueLabels && (this._leftLabel("option", "show", "hide"), this._rightLabel("option", "show", "hide"))
    },
    _reactivateLabels: function () {
      "change" === this.options.valueLabels && (this._leftLabel("option", "show", "change"), this._rightLabel("option", "show", "change"))
    },
    _changed: function (a) {
      a === !0 && this._deactivateLabels(), (this._updateValues() || this._valuesChanged) && (this._trigger("valuesChanged"), a !== !0 && this._trigger("userValuesChanged"), this._valuesChanged = !1), a === !0 && this._reactivateLabels()
    },
    _updateValues: function () {
      var a = this._leftHandle("value"), b = this._rightHandle("value"), c = this._min(a, b), d = this._max(a, b),
        e = c !== this._values.min || d !== this._values.max;
      return this._values.min = this._min(a, b), this._values.max = this._max(a, b), e
    },
    _min: function (a, b) {
      return Math.min(a, b)
    },
    _max: function (a, b) {
      return Math.max(a, b)
    },
    _createLabel: function (b, c) {
      var d;
      return null === b ? (d = this._getLabelConstructorParameters(b, c), b = a("<div />").appendTo(this.element)[this._labelType()](d)) : (d = this._getLabelRefreshParameters(b, c), b[this._labelType()](d)), b
    },
    _getLabelConstructorParameters: function (a, b) {
      return {
        handle: b,
        handleType: this._handleType(),
        formatter: this._getFormatter(),
        show: this.options.valueLabels,
        durationIn: this.options.durationIn,
        durationOut: this.options.durationOut,
        delayOut: this.options.delayOut
      }
    },
    _getLabelRefreshParameters: function () {
      return {
        formatter: this._getFormatter(),
        show: this.options.valueLabels,
        durationIn: this.options.durationIn,
        durationOut: this.options.durationOut,
        delayOut: this.options.delayOut
      }
    },
    _getFormatter: function () {
      return this.options.formatter === !1 || null === this.options.formatter ? this._defaultFormatter : this.options.formatter
    },
    _defaultFormatter: function (a) {
      return Math.round(a)
    },
    _destroyLabel: function (a) {
      return null !== a && (a[this._labelType()]("destroy"), a.remove(), a = null), a
    },
    _createLabels: function () {
      this.labels.left = this._createLabel(this.labels.left, this.leftHandle), this.labels.right = this._createLabel(this.labels.right, this.rightHandle), this._leftLabel("pair", this.labels.right)
    },
    _destroyLabels: function () {
      this.labels.left = this._destroyLabel(this.labels.left), this.labels.right = this._destroyLabel(this.labels.right)
    },
    _stepRatio: function () {
      return this._leftHandle("stepRatio")
    },
    _scrollRightClick: function (a) {
      return this.options.enabled ? (a.preventDefault(), this._bar("startScroll"), this._bindStopScroll(), void this._continueScrolling("scrollRight", 4 * this._stepRatio(), 1)) : !1
    },
    _continueScrolling: function (a, b, c, d) {
      if (!this.options.enabled)return !1;
      this._bar(a, c), d = d || 5, d--;
      var e = this, f = 16, g = Math.max(1, 4 / this._stepRatio());
      this._scrollTimeout = setTimeout(function () {
        0 === d && (b > f ? b = Math.max(f, b / 1.5) : c = Math.min(g, 2 * c), d = 5), e._continueScrolling(a, b, c, d)
      }, b)
    },
    _scrollLeftClick: function (a) {
      return this.options.enabled ? (a.preventDefault(), this._bar("startScroll"), this._bindStopScroll(), void this._continueScrolling("scrollLeft", 4 * this._stepRatio(), 1)) : !1
    },
    _bindStopScroll: function () {
      var b = this;
      this._stopScrollHandle = function (a) {
        a.preventDefault(), b._stopScroll()
      }, a(document).bind("mouseup touchend", this._stopScrollHandle)
    },
    _stopScroll: function () {
      a(document).unbind("mouseup touchend", this._stopScrollHandle), this._stopScrollHandle = null, this._bar("stopScroll"), clearTimeout(this._scrollTimeout)
    },
    _createRuler: function () {
      this.ruler = a("<div class='ui-rangeSlider-ruler' />").appendTo(this.innerBar)
    },
    _setRulerParameters: function () {
      this.ruler.ruler({min: this.options.bounds.min, max: this.options.bounds.max, scales: this.options.scales})
    },
    _destroyRuler: function () {
      null !== this.ruler && a.fn.ruler && (this.ruler.ruler("destroy"), this.ruler.remove(), this.ruler = null)
    },
    _updateRuler: function () {
      this._destroyRuler(), this.options.scales !== !1 && a.fn.ruler && (this._createRuler(), this._setRulerParameters())
    },
    values: function (a, b) {
      var c;
      if ("undefined" != typeof a && "undefined" != typeof b) {
        if (!this._initialized)return this._values.min = a, this._values.max = b, this._values;
        this._deactivateLabels(), c = this._bar("values", a, b), this._changed(!0), this._reactivateLabels()
      } else c = this._bar("values", a, b);
      return c
    },
    min: function (a) {
      return this._values.min = this.values(a, this._values.max).min, this._values.min
    },
    max: function (a) {
      return this._values.max = this.values(this._values.min, a).max, this._values.max
    },
    bounds: function (a, b) {
      return this._isValidValue(a) && this._isValidValue(b) && b > a && (this._setBounds(a, b), this._updateRuler(), this._changed(!0)), this.options.bounds
    },
    _isValidValue: function (a) {
      return "undefined" != typeof a && parseFloat(a) === a
    },
    _setBounds: function (a, b) {
      this.options.bounds = {
        min: a,
        max: b
      }, this._leftHandle("option", "bounds", this.options.bounds), this._rightHandle("option", "bounds", this.options.bounds), this._bar("option", "bounds", this.options.bounds)
    },
    zoomIn: function (a) {
      this._bar("zoomIn", a)
    },
    zoomOut: function (a) {
      this._bar("zoomOut", a)
    },
    scrollLeft: function (a) {
      this._bar("startScroll"), this._bar("scrollLeft", a), this._bar("stopScroll")
    },
    scrollRight: function (a) {
      this._bar("startScroll"), this._bar("scrollRight", a), this._bar("stopScroll")
    },
    resize: function () {
      this.container && (this._initWidth(), this._leftHandle("update"), this._rightHandle("update"), this._bar("update"))
    },
    enable: function () {
      this.toggle(!0)
    },
    disable: function () {
      this.toggle(!1)
    },
    toggle: function (a) {
      a === b && (a = !this.options.enabled), this.options.enabled !== a && this._toggle(a)
    },
    _toggle: function (a) {
      this.options.enabled = a, this.element.toggleClass("ui-rangeSlider-disabled", !a);
      var b = a ? "enable" : "disable";
      this._bar(b), this._leftHandle(b), this._rightHandle(b), this._leftLabel(b), this._rightLabel(b)
    },
    destroy: function () {
      this.element.removeClass("ui-rangeSlider-withArrows ui-rangeSlider-noArrow ui-rangeSlider-disabled"), this._destroyWidgets(), this._destroyElements(), this.element.removeClass("ui-rangeSlider"), this.options = null, a(window).unbind("resize", this._resizeProxy), this._resizeProxy = null, this._bindResize = null, a.Widget.prototype.destroy.apply(this, arguments)
    },
    _destroyWidget: function (a) {
      this["_" + a]("destroy"), this[a].remove(), this[a] = null
    },
    _destroyWidgets: function () {
      this._destroyWidget("bar"), this._destroyWidget("leftHandle"), this._destroyWidget("rightHandle"), this._destroyRuler(), this._destroyLabels()
    },
    _destroyElements: function () {
      this.container.remove(), this.container = null, this.innerBar.remove(), this.innerBar = null, this.arrows.left.remove(), this.arrows.right.remove(), this.arrows = null
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.rangeSliderHandle", a.ui.rangeSliderDraggable, {
    currentMove: null,
    margin: 0,
    parentElement: null,
    options: {isLeft: !0, bounds: {min: 0, max: 100}, range: !1, value: 0, step: !1},
    _value: 0,
    _left: 0,
    _create: function () {
      a.ui.rangeSliderDraggable.prototype._create.apply(this), this.element.css("position", "absolute").css("top", 0).addClass("ui-rangeSlider-handle").toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft).toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft), this.element.append("<div class='ui-rangeSlider-handle-inner' />"), this._value = this._constraintValue(this.options.value)
    },
    destroy: function () {
      this.element.empty(), a.ui.rangeSliderDraggable.prototype.destroy.apply(this)
    },
    _setOption: function (b, c) {
      "isLeft" !== b || c !== !0 && c !== !1 || c === this.options.isLeft ? "step" === b && this._checkStep(c) ? (this.options.step = c, this.update()) : "bounds" === b ? (this.options.bounds = c, this.update()) : "range" === b && this._checkRange(c) ? (this.options.range = c, this.update()) : "symmetricPositionning" === b && (this.options.symmetricPositionning = c === !0, this.update()) : (this.options.isLeft = c, this.element.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft).toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft), this._position(this._value), this.element.trigger("switch", this.options.isLeft)), a.ui.rangeSliderDraggable.prototype._setOption.apply(this, [b, c])
    },
    _checkRange: function (a) {
      return a === !1 || !this._isValidValue(a.min) && !this._isValidValue(a.max)
    },
    _isValidValue: function (a) {
      return "undefined" != typeof a && a !== !1 && parseFloat(a) !== a
    },
    _checkStep: function (a) {
      return a === !1 || parseFloat(a) === a
    },
    _initElement: function () {
      a.ui.rangeSliderDraggable.prototype._initElement.apply(this), 0 === this.cache.parent.width || null === this.cache.parent.width ? setTimeout(a.proxy(this._initElementIfNotDestroyed, this), 500) : (this._position(this._value), this._triggerMouseEvent("initialize"))
    },
    _bounds: function () {
      return this.options.bounds
    },
    _cache: function () {
      a.ui.rangeSliderDraggable.prototype._cache.apply(this), this._cacheParent()
    },
    _cacheParent: function () {
      var a = this.element.parent();
      this.cache.parent = {
        element: a,
        offset: a.offset(),
        padding: {left: this._parsePixels(a, "paddingLeft")},
        width: a.width()
      }
    },
    _position: function (a) {
      var b = this._getPositionForValue(a);
      this._applyPosition(b)
    },
    _constraintPosition: function (a) {
      var b = this._getValueForPosition(a);
      return this._getPositionForValue(b)
    },
    _applyPosition: function (b) {
      a.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [b]), this._left = b, this._setValue(this._getValueForPosition(b)), this._triggerMouseEvent("moving")
    },
    _prepareEventData: function () {
      var b = a.ui.rangeSliderDraggable.prototype._prepareEventData.apply(this);
      return b.value = this._value, b
    },
    _setValue: function (a) {
      a !== this._value && (this._value = a)
    },
    _constraintValue: function (a) {
      if (a = Math.min(a, this._bounds().max), a = Math.max(a, this._bounds().min), a = this._round(a), this.options.range !== !1) {
        var b = this.options.range.min || !1, c = this.options.range.max || !1;
        b !== !1 && (a = Math.max(a, this._round(b))), c !== !1 && (a = Math.min(a, this._round(c))), a = Math.min(a, this._bounds().max), a = Math.max(a, this._bounds().min)
      }
      return a
    },
    _round: function (a) {
      return this.options.step !== !1 && this.options.step > 0 ? Math.round(a / this.options.step) * this.options.step : a
    },
    _getPositionForValue: function (a) {
      if (!this.cache || !this.cache.parent || null === this.cache.parent.offset)return 0;
      a = this._constraintValue(a);
      var b = (a - this.options.bounds.min) / (this.options.bounds.max - this.options.bounds.min),
        c = this.cache.parent.width, d = this.cache.parent.offset.left,
        e = this.options.isLeft ? 0 : this.cache.width.outer;
      return this.options.symmetricPositionning ? b * (c - 2 * this.cache.width.outer) + d + e : b * c + d - e
    },
    _getValueForPosition: function (a) {
      var b = this._getRawValueForPositionAndBounds(a, this.options.bounds.min, this.options.bounds.max);
      return this._constraintValue(b)
    },
    _getRawValueForPositionAndBounds: function (a, b, c) {
      var d, e, f = null === this.cache.parent.offset ? 0 : this.cache.parent.offset.left;
      return this.options.symmetricPositionning ? (a -= this.options.isLeft ? 0 : this.cache.width.outer, d = this.cache.parent.width - 2 * this.cache.width.outer) : (a += this.options.isLeft ? 0 : this.cache.width.outer, d = this.cache.parent.width), 0 === d ? this._value : (e = (a - f) / d, e * (c - b) + b)
    },
    value: function (a) {
      return "undefined" != typeof a && (this._cache(), a = this._constraintValue(a), this._position(a)), this._value
    },
    update: function () {
      this._cache();
      var a = this._constraintValue(this._value), b = this._getPositionForValue(a);
      a !== this._value ? (this._triggerMouseEvent("updating"), this._position(a), this._triggerMouseEvent("update")) : b !== this.cache.offset.left && (this._triggerMouseEvent("updating"), this._position(a), this._triggerMouseEvent("update"))
    },
    position: function (a) {
      return "undefined" != typeof a && (this._cache(), a = this._constraintPosition(a), this._applyPosition(a)), this._left
    },
    add: function (a, b) {
      return a + b
    },
    substract: function (a, b) {
      return a - b
    },
    stepsBetween: function (a, b) {
      return this.options.step === !1 ? b - a : (b - a) / this.options.step
    },
    multiplyStep: function (a, b) {
      return a * b
    },
    moveRight: function (a) {
      var b;
      return this.options.step === !1 ? (b = this._left, this.position(this._left + a), this._left - b) : (b = this._value, this.value(this.add(b, this.multiplyStep(this.options.step, a))), this.stepsBetween(b, this._value))
    },
    moveLeft: function (a) {
      return -this.moveRight(-a)
    },
    stepRatio: function () {
      if (this.options.step === !1)return 1;
      var a = (this.options.bounds.max - this.options.bounds.min) / this.options.step;
      return this.cache.parent.width / a
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  function c(a, b) {
    return "undefined" == typeof a ? b || !1 : a
  }

  a.widget("ui.rangeSliderBar", a.ui.rangeSliderDraggable, {
    options: {
      leftHandle: null,
      rightHandle: null,
      bounds: {min: 0, max: 100},
      type: "rangeSliderHandle",
      range: !1,
      drag: function () {
      },
      stop: function () {
      },
      values: {min: 0, max: 20},
      wheelSpeed: 4,
      wheelMode: null
    }, _values: {min: 0, max: 20}, _waitingToInit: 2, _wheelTimeout: !1, _create: function () {
      a.ui.rangeSliderDraggable.prototype._create.apply(this), this.element.css("position", "absolute").css("top", 0).addClass("ui-rangeSlider-bar"), this.options.leftHandle.bind("initialize", a.proxy(this._onInitialized, this)).bind("mousestart", a.proxy(this._cache, this)).bind("stop", a.proxy(this._onHandleStop, this)), this.options.rightHandle.bind("initialize", a.proxy(this._onInitialized, this)).bind("mousestart", a.proxy(this._cache, this)).bind("stop", a.proxy(this._onHandleStop, this)), this._bindHandles(), this._values = this.options.values, this._setWheelModeOption(this.options.wheelMode)
    }, destroy: function () {
      this.options.leftHandle.unbind(".bar"), this.options.rightHandle.unbind(".bar"), this.options = null, a.ui.rangeSliderDraggable.prototype.destroy.apply(this)
    }, _setOption: function (a, b) {
      "range" === a ? this._setRangeOption(b) : "wheelSpeed" === a ? this._setWheelSpeedOption(b) : "wheelMode" === a && this._setWheelModeOption(b)
    }, _setRangeOption: function (a) {
      if (("object" != typeof a || null === a) && (a = !1), a !== !1 || this.options.range !== !1) {
        if (a !== !1) {
          var b = c(a.min, this.options.range.min), d = c(a.max, this.options.range.max);
          this.options.range = {min: b, max: d}
        } else this.options.range = !1;
        this._setLeftRange(), this._setRightRange()
      }
    }, _setWheelSpeedOption: function (a) {
      "number" == typeof a && 0 !== a && (this.options.wheelSpeed = a)
    }, _setWheelModeOption: function (a) {
      (null === a || a === !1 || "zoom" === a || "scroll" === a) && (this.options.wheelMode !== a && this.element.parent().unbind("mousewheel.bar"), this._bindMouseWheel(a), this.options.wheelMode = a)
    }, _bindMouseWheel: function (b) {
      "zoom" === b ? this.element.parent().bind("mousewheel.bar", a.proxy(this._mouseWheelZoom, this)) : "scroll" === b && this.element.parent().bind("mousewheel.bar", a.proxy(this._mouseWheelScroll, this))
    }, _setLeftRange: function () {
      if (this.options.range === !1)return !1;
      var a = this._values.max, b = {min: !1, max: !1};
      "undefined" != typeof this.options.range.min && this.options.range.min !== !1 ? b.max = this._leftHandle("substract", a, this.options.range.min) : b.max = !1, "undefined" != typeof this.options.range.max && this.options.range.max !== !1 ? b.min = this._leftHandle("substract", a, this.options.range.max) : b.min = !1, this._leftHandle("option", "range", b)
    }, _setRightRange: function () {
      var a = this._values.min, b = {min: !1, max: !1};
      "undefined" != typeof this.options.range.min && this.options.range.min !== !1 ? b.min = this._rightHandle("add", a, this.options.range.min) : b.min = !1, "undefined" != typeof this.options.range.max && this.options.range.max !== !1 ? b.max = this._rightHandle("add", a, this.options.range.max) : b.max = !1, this._rightHandle("option", "range", b)
    }, _deactivateRange: function () {
      this._leftHandle("option", "range", !1), this._rightHandle("option", "range", !1)
    }, _reactivateRange: function () {
      this._setRangeOption(this.options.range)
    }, _onInitialized: function () {
      this._waitingToInit--, 0 === this._waitingToInit && this._initMe()
    }, _initMe: function () {
      this._cache(), this.min(this._values.min), this.max(this._values.max);
      var a = this._leftHandle("position"), b = this._rightHandle("position") + this.options.rightHandle.width();
      this.element.offset({left: a}), this.element.css("width", b - a)
    }, _leftHandle: function () {
      return this._handleProxy(this.options.leftHandle, arguments)
    }, _rightHandle: function () {
      return this._handleProxy(this.options.rightHandle, arguments)
    }, _handleProxy: function (a, b) {
      var c = Array.prototype.slice.call(b);
      return a[this.options.type].apply(a, c)
    }, _cache: function () {
      a.ui.rangeSliderDraggable.prototype._cache.apply(this), this._cacheHandles()
    }, _cacheHandles: function () {
      this.cache.rightHandle = {}, this.cache.rightHandle.width = this.options.rightHandle.width(), this.cache.rightHandle.offset = this.options.rightHandle.offset(), this.cache.leftHandle = {}, this.cache.leftHandle.offset = this.options.leftHandle.offset()
    }, _mouseStart: function (b) {
      a.ui.rangeSliderDraggable.prototype._mouseStart.apply(this, [b]), this._deactivateRange()
    }, _mouseStop: function (b) {
      a.ui.rangeSliderDraggable.prototype._mouseStop.apply(this, [b]), this._cacheHandles(), this._values.min = this._leftHandle("value"), this._values.max = this._rightHandle("value"), this._reactivateRange(), this._leftHandle().trigger("stop"), this._rightHandle().trigger("stop")
    }, _onDragLeftHandle: function (a, b) {
      if (this._cacheIfNecessary(), b.element[0] === this.options.leftHandle[0]) {
        if (this._switchedValues())return this._switchHandles(), void this._onDragRightHandle(a, b);
        this._values.min = b.value, this.cache.offset.left = b.offset.left, this.cache.leftHandle.offset = b.offset, this._positionBar()
      }
    }, _onDragRightHandle: function (a, b) {
      if (this._cacheIfNecessary(), b.element[0] === this.options.rightHandle[0]) {
        if (this._switchedValues())return this._switchHandles(), void this._onDragLeftHandle(a, b);
        this._values.max = b.value, this.cache.rightHandle.offset = b.offset, this._positionBar()
      }
    }, _positionBar: function () {
      var a = this.cache.rightHandle.offset.left + this.cache.rightHandle.width - this.cache.leftHandle.offset.left;
      this.cache.width.inner = a, this.element.css("width", a).offset({left: this.cache.leftHandle.offset.left})
    }, _onHandleStop: function () {
      this._setLeftRange(), this._setRightRange()
    }, _switchedValues: function () {
      if (this.min() > this.max()) {
        var a = this._values.min;
        return this._values.min = this._values.max, this._values.max = a, !0
      }
      return !1
    }, _switchHandles: function () {
      var a = this.options.leftHandle;
      this.options.leftHandle = this.options.rightHandle, this.options.rightHandle = a, this._leftHandle("option", "isLeft", !0), this._rightHandle("option", "isLeft", !1), this._bindHandles(), this._cacheHandles()
    }, _bindHandles: function () {
      this.options.leftHandle.unbind(".bar").bind("sliderDrag.bar update.bar moving.bar", a.proxy(this._onDragLeftHandle, this)), this.options.rightHandle.unbind(".bar").bind("sliderDrag.bar update.bar moving.bar", a.proxy(this._onDragRightHandle, this))
    }, _constraintPosition: function (b) {
      var c, d = {};
      return d.left = a.ui.rangeSliderDraggable.prototype._constraintPosition.apply(this, [b]), d.left = this._leftHandle("position", d.left), c = this._rightHandle("position", d.left + this.cache.width.outer - this.cache.rightHandle.width), d.width = c - d.left + this.cache.rightHandle.width, d
    }, _applyPosition: function (b) {
      a.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [b.left]), this.element.width(b.width)
    }, _mouseWheelZoom: function (b, c, d, e) {
      if (!this.enabled)return !1;
      var f = this._values.min + (this._values.max - this._values.min) / 2, g = {}, h = {};
      return this.options.range === !1 || this.options.range.min === !1 ? (g.max = f, h.min = f) : (g.max = f - this.options.range.min / 2, h.min = f + this.options.range.min / 2), this.options.range !== !1 && this.options.range.max !== !1 && (g.min = f - this.options.range.max / 2, h.max = f + this.options.range.max / 2), this._leftHandle("option", "range", g), this._rightHandle("option", "range", h), clearTimeout(this._wheelTimeout), this._wheelTimeout = setTimeout(a.proxy(this._wheelStop, this), 200), this.zoomIn(e * this.options.wheelSpeed), !1
    }, _mouseWheelScroll: function (b, c, d, e) {
      return this.enabled ? (this._wheelTimeout === !1 ? this.startScroll() : clearTimeout(this._wheelTimeout), this._wheelTimeout = setTimeout(a.proxy(this._wheelStop, this), 200), this.scrollLeft(e * this.options.wheelSpeed), !1) : !1
    }, _wheelStop: function () {
      this.stopScroll(), this._wheelTimeout = !1
    }, min: function (a) {
      return this._leftHandle("value", a)
    }, max: function (a) {
      return this._rightHandle("value", a)
    }, startScroll: function () {
      this._deactivateRange()
    }, stopScroll: function () {
      this._reactivateRange(), this._triggerMouseEvent("stop"), this._leftHandle().trigger("stop"), this._rightHandle().trigger("stop")
    }, scrollLeft: function (a) {
      return a = a || 1, 0 > a ? this.scrollRight(-a) : (a = this._leftHandle("moveLeft", a), this._rightHandle("moveLeft", a), this.update(), void this._triggerMouseEvent("scroll"))
    }, scrollRight: function (a) {
      return a = a || 1, 0 > a ? this.scrollLeft(-a) : (a = this._rightHandle("moveRight", a), this._leftHandle("moveRight", a), this.update(), void this._triggerMouseEvent("scroll"))
    }, zoomIn: function (a) {
      if (a = a || 1, 0 > a)return this.zoomOut(-a);
      var b = this._rightHandle("moveLeft", a);
      a > b && (b /= 2, this._rightHandle("moveRight", b)), this._leftHandle("moveRight", b), this.update(), this._triggerMouseEvent("zoom")
    }, zoomOut: function (a) {
      if (a = a || 1, 0 > a)return this.zoomIn(-a);
      var b = this._rightHandle("moveRight", a);
      a > b && (b /= 2, this._rightHandle("moveLeft", b)), this._leftHandle("moveLeft", b), this.update(), this._triggerMouseEvent("zoom")
    }, values: function (a, b) {
      if ("undefined" != typeof a && "undefined" != typeof b) {
        var c = Math.min(a, b), d = Math.max(a, b);
        this._deactivateRange(), this.options.leftHandle.unbind(".bar"), this.options.rightHandle.unbind(".bar"), this._values.min = this._leftHandle("value", c), this._values.max = this._rightHandle("value", d), this._bindHandles(), this._reactivateRange(), this.update()
      }
      return {min: this._values.min, max: this._values.max}
    }, update: function () {
      this._values.min = this.min(), this._values.max = this.max(), this._cache(), this._positionBar()
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  function c(b, c, d, e) {
    this.label1 = b, this.label2 = c, this.type = d, this.options = e, this.handle1 = this.label1[this.type]("option", "handle"), this.handle2 = this.label2[this.type]("option", "handle"), this.cache = null, this.left = b, this.right = c, this.moving = !1, this.initialized = !1, this.updating = !1, this.Init = function () {
      this.BindHandle(this.handle1), this.BindHandle(this.handle2), "show" === this.options.show ? (setTimeout(a.proxy(this.PositionLabels, this), 1), this.initialized = !0) : setTimeout(a.proxy(this.AfterInit, this), 1e3), this._resizeProxy = a.proxy(this.onWindowResize, this), a(window).resize(this._resizeProxy)
    }, this.Destroy = function () {
      this._resizeProxy && (a(window).unbind("resize", this._resizeProxy), this._resizeProxy = null, this.handle1.unbind(".positionner"), this.handle1 = null, this.handle2.unbind(".positionner"), this.handle2 = null, this.label1 = null, this.label2 = null, this.left = null, this.right = null), this.cache = null
    }, this.AfterInit = function () {
      this.initialized = !0
    }, this.Cache = function () {
      "none" !== this.label1.css("display") && (this.cache = {}, this.cache.label1 = {}, this.cache.label2 = {}, this.cache.handle1 = {}, this.cache.handle2 = {}, this.cache.offsetParent = {}, this.CacheElement(this.label1, this.cache.label1), this.CacheElement(this.label2, this.cache.label2), this.CacheElement(this.handle1, this.cache.handle1), this.CacheElement(this.handle2, this.cache.handle2), this.CacheElement(this.label1.offsetParent(), this.cache.offsetParent))
    }, this.CacheIfNecessary = function () {
      null === this.cache ? this.Cache() : (this.CacheWidth(this.label1, this.cache.label1), this.CacheWidth(this.label2, this.cache.label2), this.CacheHeight(this.label1, this.cache.label1), this.CacheHeight(this.label2, this.cache.label2), this.CacheWidth(this.label1.offsetParent(), this.cache.offsetParent))
    }, this.CacheElement = function (a, b) {
      this.CacheWidth(a, b), this.CacheHeight(a, b), b.offset = a.offset(), b.margin = {
        left: this.ParsePixels("marginLeft", a),
        right: this.ParsePixels("marginRight", a)
      }, b.border = {left: this.ParsePixels("borderLeftWidth", a), right: this.ParsePixels("borderRightWidth", a)}
    }, this.CacheWidth = function (a, b) {
      b.width = a.width(), b.outerWidth = a.outerWidth()
    }, this.CacheHeight = function (a, b) {
      b.outerHeightMargin = a.outerHeight(!0)
    }, this.ParsePixels = function (a, b) {
      return parseInt(b.css(a), 10) || 0
    }, this.BindHandle = function (b) {
      b.bind("updating.positionner", a.proxy(this.onHandleUpdating, this)), b.bind("update.positionner", a.proxy(this.onHandleUpdated, this)), b.bind("moving.positionner", a.proxy(this.onHandleMoving, this)), b.bind("stop.positionner", a.proxy(this.onHandleStop, this))
    }, this.PositionLabels = function () {
      if (this.CacheIfNecessary(), null !== this.cache) {
        var a = this.GetRawPosition(this.cache.label1, this.cache.handle1),
          b = this.GetRawPosition(this.cache.label2, this.cache.handle2);
        this.label1[d]("option", "isLeft") ? this.ConstraintPositions(a, b) : this.ConstraintPositions(b, a), this.PositionLabel(this.label1, a.left, this.cache.label1), this.PositionLabel(this.label2, b.left, this.cache.label2)
      }
    }, this.PositionLabel = function (a, b, c) {
      var d, e, f, g = this.cache.offsetParent.offset.left + this.cache.offsetParent.border.left;
      g - b >= 0 ? (a.css("right", ""), a.offset({left: b})) : (d = g + this.cache.offsetParent.width, e = b + c.margin.left + c.outerWidth + c.margin.right, f = d - e, a.css("left", ""), a.css("right", f))
    }, this.ConstraintPositions = function (a, b) {
      (a.center < b.center && a.outerRight > b.outerLeft || a.center > b.center && b.outerRight > a.outerLeft) && (a = this.getLeftPosition(a, b), b = this.getRightPosition(a, b))
    }, this.getLeftPosition = function (a, b) {
      var c = (b.center + a.center) / 2, d = c - a.cache.outerWidth - a.cache.margin.right + a.cache.border.left;
      return a.left = d, a
    }, this.getRightPosition = function (a, b) {
      var c = (b.center + a.center) / 2;
      return b.left = c + b.cache.margin.left + b.cache.border.left, b
    }, this.ShowIfNecessary = function () {
      "show" === this.options.show || this.moving || !this.initialized || this.updating || (this.label1.stop(!0, !0).fadeIn(this.options.durationIn || 0), this.label2.stop(!0, !0).fadeIn(this.options.durationIn || 0), this.moving = !0)
    }, this.HideIfNeeded = function () {
      this.moving === !0 && (this.label1.stop(!0, !0).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0), this.label2.stop(!0, !0).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0), this.moving = !1)
    }, this.onHandleMoving = function (a, b) {
      this.ShowIfNecessary(), this.CacheIfNecessary(), this.UpdateHandlePosition(b), this.PositionLabels()
    }, this.onHandleUpdating = function () {
      this.updating = !0
    }, this.onHandleUpdated = function () {
      this.updating = !1, this.cache = null
    }, this.onHandleStop = function () {
      this.HideIfNeeded()
    }, this.onWindowResize = function () {
      this.cache = null
    }, this.UpdateHandlePosition = function (a) {
      null !== this.cache && (a.element[0] === this.handle1[0] ? this.UpdatePosition(a, this.cache.handle1) : this.UpdatePosition(a, this.cache.handle2))
    }, this.UpdatePosition = function (a, b) {
      b.offset = a.offset, b.value = a.value
    }, this.GetRawPosition = function (a, b) {
      var c = b.offset.left + b.outerWidth / 2, d = c - a.outerWidth / 2,
        e = d + a.outerWidth - a.border.left - a.border.right, f = d - a.margin.left - a.border.left,
        g = b.offset.top - a.outerHeightMargin;
      return {
        left: d,
        outerLeft: f,
        top: g,
        right: e,
        outerRight: f + a.outerWidth + a.margin.left + a.margin.right,
        cache: a,
        center: c
      }
    }, this.Init()
  }

  a.widget("ui.rangeSliderLabel", a.ui.rangeSliderMouseTouch, {
    options: {
      handle: null,
      formatter: !1,
      handleType: "rangeSliderHandle",
      show: "show",
      durationIn: 0,
      durationOut: 500,
      delayOut: 500,
      isLeft: !1
    }, cache: null, _positionner: null, _valueContainer: null, _innerElement: null, _value: null, _create: function () {
      this.options.isLeft = this._handle("option", "isLeft"), this.element.addClass("ui-rangeSlider-label").css("position", "absolute").css("display", "block"), this._createElements(), this._toggleClass(), this.options.handle.bind("moving.label", a.proxy(this._onMoving, this)).bind("update.label", a.proxy(this._onUpdate, this)).bind("switch.label", a.proxy(this._onSwitch, this)), "show" !== this.options.show && this.element.hide(), this._mouseInit()
    }, destroy: function () {
      this.options.handle.unbind(".label"), this.options.handle = null, this._valueContainer = null, this._innerElement = null, this.element.empty(), this._positionner && (this._positionner.Destroy(), this._positionner = null), a.ui.rangeSliderMouseTouch.prototype.destroy.apply(this)
    }, _createElements: function () {
      this._valueContainer = a("<div class='ui-rangeSlider-label-value' />").appendTo(this.element), this._innerElement = a("<div class='ui-rangeSlider-label-inner' />").appendTo(this.element)
    }, _handle: function () {
      var a = Array.prototype.slice.apply(arguments);
      return this.options.handle[this.options.handleType].apply(this.options.handle, a)
    }, _setOption: function (a, b) {
      "show" === a ? this._updateShowOption(b) : ("durationIn" === a || "durationOut" === a || "delayOut" === a) && this._updateDurations(a, b), this._setFormatterOption(a, b)
    }, _setFormatterOption: function (a, b) {
      "formatter" === a && ("function" == typeof b || b === !1) && (this.options.formatter = b, this._display(this._value))
    }, _updateShowOption: function (a) {
      this.options.show = a, "show" !== this.options.show ? (this.element.hide(), this._positionner.moving = !1) : (this.element.show(), this._display(this.options.handle[this.options.handleType]("value")), this._positionner.PositionLabels()), this._positionner.options.show = this.options.show
    }, _updateDurations: function (a, b) {
      parseInt(b, 10) === b && (this._positionner.options[a] = b, this.options[a] = b)
    }, _display: function (a) {
      this.options.formatter === !1 ? this._displayText(Math.round(a)) : this._displayText(this.options.formatter(a)), this._value = a
    }, _displayText: function (a) {
      this._valueContainer.text(a)
    }, _toggleClass: function () {
      this.element.toggleClass("ui-rangeSlider-leftLabel", this.options.isLeft).toggleClass("ui-rangeSlider-rightLabel", !this.options.isLeft)
    }, _positionLabels: function () {
      this._positionner.PositionLabels()
    }, _mouseDown: function (a) {
      this.options.handle.trigger(a)
    }, _mouseUp: function (a) {
      this.options.handle.trigger(a)
    }, _mouseMove: function (a) {
      this.options.handle.trigger(a)
    }, _onMoving: function (a, b) {
      this._display(b.value)
    }, _onUpdate: function () {
      "show" === this.options.show && this.update()
    }, _onSwitch: function (a, b) {
      this.options.isLeft = b, this._toggleClass(), this._positionLabels()
    }, pair: function (a) {
      null === this._positionner && (this._positionner = new c(this.element, a, this.widgetName, {
        show: this.options.show,
        durationIn: this.options.durationIn,
        durationOut: this.options.durationOut,
        delayOut: this.options.delayOut
      }), a[this.widgetName]("positionner", this._positionner))
    }, positionner: function (a) {
      return "undefined" != typeof a && (this._positionner = a), this._positionner
    }, update: function () {
      this._positionner.cache = null, this._display(this._handle("value")), "show" === this.options.show && this._positionLabels()
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.dateRangeSlider", a.ui.rangeSlider, {
    options: {
      bounds: {
        min: new Date(2010, 0, 1).valueOf(),
        max: new Date(2012, 0, 1).valueOf()
      }, defaultValues: {min: new Date(2010, 1, 11).valueOf(), max: new Date(2011, 1, 11).valueOf()}
    }, _create: function () {
      a.ui.rangeSlider.prototype._create.apply(this), this.element.addClass("ui-dateRangeSlider")
    }, destroy: function () {
      this.element.removeClass("ui-dateRangeSlider"), a.ui.rangeSlider.prototype.destroy.apply(this)
    }, _setDefaultValues: function () {
      this._values = {min: this.options.defaultValues.min.valueOf(), max: this.options.defaultValues.max.valueOf()}
    }, _setRulerParameters: function () {
      this.ruler.ruler({
        min: new Date(this.options.bounds.min.valueOf()),
        max: new Date(this.options.bounds.max.valueOf()),
        scales: this.options.scales
      })
    }, _setOption: function (b, c) {
      ("defaultValues" === b || "bounds" === b) && "undefined" != typeof c && null !== c && this._isValidDate(c.min) && this._isValidDate(c.max) ? a.ui.rangeSlider.prototype._setOption.apply(this, [b, {
        min: c.min.valueOf(),
        max: c.max.valueOf()
      }]) : a.ui.rangeSlider.prototype._setOption.apply(this, this._toArray(arguments))
    }, _handleType: function () {
      return "dateRangeSliderHandle"
    }, option: function (b) {
      if ("bounds" === b || "defaultValues" === b) {
        var c = a.ui.rangeSlider.prototype.option.apply(this, arguments);
        return {min: new Date(c.min), max: new Date(c.max)}
      }
      return a.ui.rangeSlider.prototype.option.apply(this, this._toArray(arguments))
    }, _defaultFormatter: function (a) {
      var b = a.getMonth() + 1, c = a.getDate();
      return "" + a.getFullYear() + "-" + (10 > b ? "0" + b : b) + "-" + (10 > c ? "0" + c : c)
    }, _getFormatter: function () {
      var a = this.options.formatter;
      return (this.options.formatter === !1 || null === this.options.formatter) && (a = this._defaultFormatter), function (a) {
        return function (b) {
          return a(new Date(b))
        }
      }(a)
    }, values: function (b, c) {
      var d = null;
      return d = this._isValidDate(b) && this._isValidDate(c) ? a.ui.rangeSlider.prototype.values.apply(this, [b.valueOf(), c.valueOf()]) : a.ui.rangeSlider.prototype.values.apply(this, this._toArray(arguments)), {
        min: new Date(d.min),
        max: new Date(d.max)
      }
    }, min: function (b) {
      return this._isValidDate(b) ? new Date(a.ui.rangeSlider.prototype.min.apply(this, [b.valueOf()])) : new Date(a.ui.rangeSlider.prototype.min.apply(this))
    }, max: function (b) {
      return this._isValidDate(b) ? new Date(a.ui.rangeSlider.prototype.max.apply(this, [b.valueOf()])) : new Date(a.ui.rangeSlider.prototype.max.apply(this))
    }, bounds: function (b, c) {
      var d;
      return d = this._isValidDate(b) && this._isValidDate(c) ? a.ui.rangeSlider.prototype.bounds.apply(this, [b.valueOf(), c.valueOf()]) : a.ui.rangeSlider.prototype.bounds.apply(this, this._toArray(arguments)), {
        min: new Date(d.min),
        max: new Date(d.max)
      }
    }, _isValidDate: function (a) {
      return "undefined" != typeof a && a instanceof Date
    }, _toArray: function (a) {
      return Array.prototype.slice.call(a)
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.dateRangeSliderHandle", a.ui.rangeSliderHandle, {
    _steps: !1, _boundsValues: {}, _create: function () {
      this._createBoundsValues(), a.ui.rangeSliderHandle.prototype._create.apply(this)
    }, _getValueForPosition: function (a) {
      var b = this._getRawValueForPositionAndBounds(a, this.options.bounds.min.valueOf(), this.options.bounds.max.valueOf());
      return this._constraintValue(new Date(b))
    }, _setOption: function (b, c) {
      return "step" === b ? (this.options.step = c, this._createSteps(), void this.update()) : (a.ui.rangeSliderHandle.prototype._setOption.apply(this, [b, c]), void("bounds" === b && this._createBoundsValues()))
    }, _createBoundsValues: function () {
      this._boundsValues = {min: this.options.bounds.min.valueOf(), max: this.options.bounds.max.valueOf()}
    }, _bounds: function () {
      return this._boundsValues
    }, _createSteps: function () {
      if (this.options.step === !1 || !this._isValidStep())return void(this._steps = !1);
      var a = new Date(this.options.bounds.min.valueOf()), b = new Date(this.options.bounds.max.valueOf()), c = a,
        d = 0, e = new Date;
      for (this._steps = []; b >= c && (1 === d || e.valueOf() !== c.valueOf());)e = c, this._steps.push(c.valueOf()), c = this._addStep(a, d, this.options.step), d++;
      e.valueOf() === c.valueOf() && (this._steps = !1)
    }, _isValidStep: function () {
      return "object" == typeof this.options.step
    }, _addStep: function (a, b, c) {
      var d = new Date(a.valueOf());
      return d = this._addThing(d, "FullYear", b, c.years), d = this._addThing(d, "Month", b, c.months), d = this._addThing(d, "Date", b, 7 * c.weeks), d = this._addThing(d, "Date", b, c.days), d = this._addThing(d, "Hours", b, c.hours), d = this._addThing(d, "Minutes", b, c.minutes), d = this._addThing(d, "Seconds", b, c.seconds)
    }, _addThing: function (a, b, c, d) {
      return 0 === c || 0 === (d || 0) ? a : (a["set" + b](a["get" + b]() + c * (d || 0)), a)
    }, _round: function (a) {
      if (this._steps === !1)return a;
      for (var b, c, d = this.options.bounds.max.valueOf(), e = this.options.bounds.min.valueOf(),
             f = Math.max(0, (a - e) / (d - e)), g = Math.floor(this._steps.length * f); this._steps[g] > a;)g--;
      for (; g + 1 < this._steps.length && this._steps[g + 1] <= a;)g++;
      return g >= this._steps.length - 1 ? this._steps[this._steps.length - 1] : 0 === g ? this._steps[0] : (b = this._steps[g], c = this._steps[g + 1], c - a > a - b ? b : c)
    }, update: function () {
      this._createBoundsValues(), this._createSteps(), a.ui.rangeSliderHandle.prototype.update.apply(this)
    }, add: function (a, b) {
      return this._addStep(new Date(a), 1, b).valueOf()
    }, substract: function (a, b) {
      return this._addStep(new Date(a), -1, b).valueOf()
    }, stepsBetween: function (a, b) {
      if (this.options.step === !1)return b - a;
      var c = Math.min(a, b), d = Math.max(a, b), e = 0, f = !1, g = a > b;
      for (this.add(c, this.options.step) - c < 0 && (f = !0); d > c;)f ? d = this.add(d, this.options.step) : c = this.add(c, this.options.step), e++;
      return g ? -e : e
    }, multiplyStep: function (a, b) {
      var c = {};
      for (var d in a)a.hasOwnProperty(d) && (c[d] = a[d] * b);
      return c
    }, stepRatio: function () {
      if (this.options.step === !1)return 1;
      var a = this._steps.length;
      return this.cache.parent.width / a
    }
  })
}(jQuery), function (a, b) {
  "use strict";
  a.widget("ui.editRangeSlider", a.ui.rangeSlider, {
    options: {type: "text", round: 1}, _create: function () {
      a.ui.rangeSlider.prototype._create.apply(this), this.element.addClass("ui-editRangeSlider")
    }, destroy: function () {
      this.element.removeClass("ui-editRangeSlider"), a.ui.rangeSlider.prototype.destroy.apply(this)
    }, _setOption: function (b, c) {
      ("type" === b || "step" === b) && this._setLabelOption(b, c), "type" === b && (this.options[b] = null === this.labels.left ? c : this._leftLabel("option", b)), a.ui.rangeSlider.prototype._setOption.apply(this, [b, c])
    }, _setLabelOption: function (a, b) {
      null !== this.labels.left && (this._leftLabel("option", a, b), this._rightLabel("option", a, b))
    }, _labelType: function () {
      return "editRangeSliderLabel"
    }, _createLabel: function (b, c) {
      var d = a.ui.rangeSlider.prototype._createLabel.apply(this, [b, c]);
      return null === b && d.bind("valueChange", a.proxy(this._onValueChange, this)), d
    }, _addPropertiesToParameter: function (a) {
      return a.type = this.options.type, a.step = this.options.step, a.id = this.element.attr("id"), a
    }, _getLabelConstructorParameters: function (b, c) {
      var d = a.ui.rangeSlider.prototype._getLabelConstructorParameters.apply(this, [b, c]);
      return this._addPropertiesToParameter(d)
    }, _getLabelRefreshParameters: function (b, c) {
      var d = a.ui.rangeSlider.prototype._getLabelRefreshParameters.apply(this, [b, c]);
      return this._addPropertiesToParameter(d)
    }, _onValueChange: function (a, b) {
      var c = !1;
      c = b.isLeft ? this._values.min !== this.min(b.value) : this._values.max !== this.max(b.value), c && this._trigger("userValuesChanged")
    }
  })
}(jQuery), function (a) {
  "use strict";
  a.widget("ui.editRangeSliderLabel", a.ui.rangeSliderLabel, {
    options: {type: "text", step: !1, id: ""},
    _input: null,
    _text: "",
    _create: function () {
      a.ui.rangeSliderLabel.prototype._create.apply(this), this._createInput()
    },
    _setOption: function (b, c) {
      "type" === b ? this._setTypeOption(c) : "step" === b && this._setStepOption(c), a.ui.rangeSliderLabel.prototype._setOption.apply(this, [b, c])
    },
    _createInput: function () {
      this._input = a("<input type='" + this.options.type + "' />").addClass("ui-editRangeSlider-inputValue").appendTo(this._valueContainer), this._setInputName(), this._input.bind("keyup", a.proxy(this._onKeyUp, this)), this._input.blur(a.proxy(this._onChange, this)), "number" === this.options.type && (this.options.step !== !1 && this._input.attr("step", this.options.step), this._input.click(a.proxy(this._onChange, this))), this._input.val(this._text)
    },
    _setInputName: function () {
      var a = this.options.isLeft ? "left" : "right";
      this._input.attr("name", this.options.id + a)
    },
    _onSwitch: function (b, c) {
      a.ui.rangeSliderLabel.prototype._onSwitch.apply(this, [b, c]), this._setInputName()
    },
    _destroyInput: function () {
      this._input.remove(), this._input = null
    },
    _onKeyUp: function (a) {
      return 13 === a.which ? (this._onChange(a), !1) : void 0
    },
    _onChange: function () {
      var a = this._returnCheckedValue(this._input.val());
      a !== !1 && this._triggerValue(a)
    },
    _triggerValue: function (a) {
      var b = this.options.handle[this.options.handleType]("option", "isLeft");
      this.element.trigger("valueChange", [{isLeft: b, value: a}])
    },
    _returnCheckedValue: function (a) {
      var b = parseFloat(a);
      return isNaN(b) || isNaN(Number(a)) ? !1 : b
    },
    _setTypeOption: function (a) {
      "text" !== a && "number" !== a || this.options.type === a || (this._destroyInput(), this.options.type = a, this._createInput())
    },
    _setStepOption: function (a) {
      this.options.step = a, "number" === this.options.type && this._input.attr("step", a !== !1 ? a : "any")
    },
    _displayText: function (a) {
      this._input.val(a), this._text = a
    },
    enable: function () {
      a.ui.rangeSliderLabel.prototype.enable.apply(this), this._input.attr("disabled", null)
    },
    disable: function () {
      a.ui.rangeSliderLabel.prototype.disable.apply(this), this._input.attr("disabled", "disabled")
    }
  })
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqUUFsbFJhbmdlU2xpZGVycy1taW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohIGpRUmFuZ2VTbGlkZXIgNS43LjIgLSAyMDE2LTAxLTE4IC0gQ29weXJpZ2h0IChDKSBHdWlsbGF1bWUgR2F1dHJlYXUgMjAxMiAtIE1JVCBhbmQgR1BMdjMgbGljZW5zZXMuKi9cclxuIWZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5yYW5nZVNsaWRlck1vdXNlVG91Y2hcIiwgYS51aS5tb3VzZSwge1xyXG4gICAgZW5hYmxlZDogITAsIF9tb3VzZUluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGIgPSB0aGlzO1xyXG4gICAgICBhLnVpLm1vdXNlLnByb3RvdHlwZS5fbW91c2VJbml0LmFwcGx5KHRoaXMpLCB0aGlzLl9tb3VzZURvd25FdmVudCA9ICExLCB0aGlzLmVsZW1lbnQuYmluZChcInRvdWNoc3RhcnQuXCIgKyB0aGlzLndpZGdldE5hbWUsIGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGIuX3RvdWNoU3RhcnQoYSlcclxuICAgICAgfSlcclxuICAgIH0sIF9tb3VzZURlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYShkb2N1bWVudCkudW5iaW5kKFwidG91Y2htb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl90b3VjaE1vdmVEZWxlZ2F0ZSkudW5iaW5kKFwidG91Y2hlbmQuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX3RvdWNoRW5kRGVsZWdhdGUpLCBhLnVpLm1vdXNlLnByb3RvdHlwZS5fbW91c2VEZXN0cm95LmFwcGx5KHRoaXMpXHJcbiAgICB9LCBlbmFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5lbmFibGVkID0gITBcclxuICAgIH0sIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5lbmFibGVkID0gITFcclxuICAgIH0sIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fbW91c2VEZXN0cm95KCksIGEudWkubW91c2UucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcyksIHRoaXMuX21vdXNlSW5pdCA9IG51bGxcclxuICAgIH0sIF90b3VjaFN0YXJ0OiBmdW5jdGlvbiAoYikge1xyXG4gICAgICBpZiAoIXRoaXMuZW5hYmxlZClyZXR1cm4gITE7XHJcbiAgICAgIGIud2hpY2ggPSAxLCBiLnByZXZlbnREZWZhdWx0KCksIHRoaXMuX2ZpbGxUb3VjaEV2ZW50KGIpO1xyXG4gICAgICB2YXIgYyA9IHRoaXMsIGQgPSB0aGlzLl9tb3VzZURvd25FdmVudDtcclxuICAgICAgdGhpcy5fbW91c2VEb3duKGIpLCBkICE9PSB0aGlzLl9tb3VzZURvd25FdmVudCAmJiAodGhpcy5fdG91Y2hFbmREZWxlZ2F0ZSA9IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgYy5fdG91Y2hFbmQoYSlcclxuICAgICAgfSwgdGhpcy5fdG91Y2hNb3ZlRGVsZWdhdGUgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGMuX3RvdWNoTW92ZShhKVxyXG4gICAgICB9LCBhKGRvY3VtZW50KS5iaW5kKFwidG91Y2htb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl90b3VjaE1vdmVEZWxlZ2F0ZSkuYmluZChcInRvdWNoZW5kLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl90b3VjaEVuZERlbGVnYXRlKSlcclxuICAgIH0sIF9tb3VzZURvd246IGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQgPyBhLnVpLm1vdXNlLnByb3RvdHlwZS5fbW91c2VEb3duLmFwcGx5KHRoaXMsIFtiXSkgOiAhMVxyXG4gICAgfSwgX3RvdWNoRW5kOiBmdW5jdGlvbiAoYikge1xyXG4gICAgICB0aGlzLl9maWxsVG91Y2hFdmVudChiKSwgdGhpcy5fbW91c2VVcChiKSwgYShkb2N1bWVudCkudW5iaW5kKFwidG91Y2htb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl90b3VjaE1vdmVEZWxlZ2F0ZSkudW5iaW5kKFwidG91Y2hlbmQuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX3RvdWNoRW5kRGVsZWdhdGUpLCB0aGlzLl9tb3VzZURvd25FdmVudCA9ICExLCBhKGRvY3VtZW50KS50cmlnZ2VyKFwibW91c2V1cFwiKVxyXG4gICAgfSwgX3RvdWNoTW92ZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIGEucHJldmVudERlZmF1bHQoKSwgdGhpcy5fZmlsbFRvdWNoRXZlbnQoYSksIHRoaXMuX21vdXNlTW92ZShhKVxyXG4gICAgfSwgX2ZpbGxUb3VjaEV2ZW50OiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYjtcclxuICAgICAgYiA9IFwidW5kZWZpbmVkXCIgPT0gdHlwZW9mIGEudGFyZ2V0VG91Y2hlcyAmJiBcInVuZGVmaW5lZFwiID09IHR5cGVvZiBhLmNoYW5nZWRUb3VjaGVzID8gYS5vcmlnaW5hbEV2ZW50LnRhcmdldFRvdWNoZXNbMF0gfHwgYS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdIDogYS50YXJnZXRUb3VjaGVzWzBdIHx8IGEuY2hhbmdlZFRvdWNoZXNbMF0sIGEucGFnZVggPSBiLnBhZ2VYLCBhLnBhZ2VZID0gYi5wYWdlWSwgYS53aGljaCA9IDFcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5yYW5nZVNsaWRlckRyYWdnYWJsZVwiLCBhLnVpLnJhbmdlU2xpZGVyTW91c2VUb3VjaCwge1xyXG4gICAgY2FjaGU6IG51bGwsXHJcbiAgICBvcHRpb25zOiB7Y29udGFpbm1lbnQ6IG51bGx9LFxyXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyTW91c2VUb3VjaC5wcm90b3R5cGUuX2NyZWF0ZS5hcHBseSh0aGlzKSwgc2V0VGltZW91dChhLnByb3h5KHRoaXMuX2luaXRFbGVtZW50SWZOb3REZXN0cm95ZWQsIHRoaXMpLCAxMClcclxuICAgIH0sXHJcbiAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuY2FjaGUgPSBudWxsLCBhLnVpLnJhbmdlU2xpZGVyTW91c2VUb3VjaC5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKVxyXG4gICAgfSxcclxuICAgIF9pbml0RWxlbWVudElmTm90RGVzdHJveWVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX21vdXNlSW5pdCAmJiB0aGlzLl9pbml0RWxlbWVudCgpXHJcbiAgICB9LFxyXG4gICAgX2luaXRFbGVtZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX21vdXNlSW5pdCgpLCB0aGlzLl9jYWNoZSgpXHJcbiAgICB9LFxyXG4gICAgX3NldE9wdGlvbjogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgXCJjb250YWlubWVudFwiID09PSBiICYmIChudWxsID09PSBjIHx8IDAgPT09IGEoYykubGVuZ3RoID8gdGhpcy5vcHRpb25zLmNvbnRhaW5tZW50ID0gbnVsbCA6IHRoaXMub3B0aW9ucy5jb250YWlubWVudCA9IGEoYykpXHJcbiAgICB9LFxyXG4gICAgX21vdXNlU3RhcnQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZSgpLCB0aGlzLmNhY2hlLmNsaWNrID0ge1xyXG4gICAgICAgIGxlZnQ6IGEucGFnZVgsXHJcbiAgICAgICAgdG9wOiBhLnBhZ2VZXHJcbiAgICAgIH0sIHRoaXMuY2FjaGUuaW5pdGlhbE9mZnNldCA9IHRoaXMuZWxlbWVudC5vZmZzZXQoKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJtb3VzZXN0YXJ0XCIpLCAhMFxyXG4gICAgfSxcclxuICAgIF9tb3VzZURyYWc6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHZhciBiID0gYS5wYWdlWCAtIHRoaXMuY2FjaGUuY2xpY2subGVmdDtcclxuICAgICAgcmV0dXJuIGIgPSB0aGlzLl9jb25zdHJhaW50UG9zaXRpb24oYiArIHRoaXMuY2FjaGUuaW5pdGlhbE9mZnNldC5sZWZ0KSwgdGhpcy5fYXBwbHlQb3NpdGlvbihiKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJzbGlkZXJEcmFnXCIpLCAhMVxyXG4gICAgfSxcclxuICAgIF9tb3VzZVN0b3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJzdG9wXCIpXHJcbiAgICB9LFxyXG4gICAgX2NvbnN0cmFpbnRQb3NpdGlvbjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIDAgIT09IHRoaXMuZWxlbWVudC5wYXJlbnQoKS5sZW5ndGggJiYgbnVsbCAhPT0gdGhpcy5jYWNoZS5wYXJlbnQub2Zmc2V0ICYmIChhID0gTWF0aC5taW4oYSwgdGhpcy5jYWNoZS5wYXJlbnQub2Zmc2V0LmxlZnQgKyB0aGlzLmNhY2hlLnBhcmVudC53aWR0aCAtIHRoaXMuY2FjaGUud2lkdGgub3V0ZXIpLCBhID0gTWF0aC5tYXgoYSwgdGhpcy5jYWNoZS5wYXJlbnQub2Zmc2V0LmxlZnQpKSwgYVxyXG4gICAgfSxcclxuICAgIF9hcHBseVBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB0aGlzLl9jYWNoZUlmTmVjZXNzYXJ5KCk7XHJcbiAgICAgIHZhciBiID0ge3RvcDogdGhpcy5jYWNoZS5vZmZzZXQudG9wLCBsZWZ0OiBhfTtcclxuICAgICAgdGhpcy5lbGVtZW50Lm9mZnNldCh7bGVmdDogYX0pLCB0aGlzLmNhY2hlLm9mZnNldCA9IGJcclxuICAgIH0sXHJcbiAgICBfY2FjaGVJZk5lY2Vzc2FyeTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBudWxsID09PSB0aGlzLmNhY2hlICYmIHRoaXMuX2NhY2hlKClcclxuICAgIH0sXHJcbiAgICBfY2FjaGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5jYWNoZSA9IHt9LCB0aGlzLl9jYWNoZU1hcmdpbnMoKSwgdGhpcy5fY2FjaGVQYXJlbnQoKSwgdGhpcy5fY2FjaGVEaW1lbnNpb25zKCksIHRoaXMuY2FjaGUub2Zmc2V0ID0gdGhpcy5lbGVtZW50Lm9mZnNldCgpXHJcbiAgICB9LFxyXG4gICAgX2NhY2hlTWFyZ2luczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmNhY2hlLm1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiB0aGlzLl9wYXJzZVBpeGVscyh0aGlzLmVsZW1lbnQsIFwibWFyZ2luTGVmdFwiKSxcclxuICAgICAgICByaWdodDogdGhpcy5fcGFyc2VQaXhlbHModGhpcy5lbGVtZW50LCBcIm1hcmdpblJpZ2h0XCIpLFxyXG4gICAgICAgIHRvcDogdGhpcy5fcGFyc2VQaXhlbHModGhpcy5lbGVtZW50LCBcIm1hcmdpblRvcFwiKSxcclxuICAgICAgICBib3R0b206IHRoaXMuX3BhcnNlUGl4ZWxzKHRoaXMuZWxlbWVudCwgXCJtYXJnaW5Cb3R0b21cIilcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9jYWNoZVBhcmVudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAobnVsbCAhPT0gdGhpcy5vcHRpb25zLnBhcmVudCkge1xyXG4gICAgICAgIHZhciBhID0gdGhpcy5lbGVtZW50LnBhcmVudCgpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUucGFyZW50ID0ge29mZnNldDogYS5vZmZzZXQoKSwgd2lkdGg6IGEud2lkdGgoKX1cclxuICAgICAgfSBlbHNlIHRoaXMuY2FjaGUucGFyZW50ID0gbnVsbFxyXG4gICAgfSxcclxuICAgIF9jYWNoZURpbWVuc2lvbnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5jYWNoZS53aWR0aCA9IHtvdXRlcjogdGhpcy5lbGVtZW50Lm91dGVyV2lkdGgoKSwgaW5uZXI6IHRoaXMuZWxlbWVudC53aWR0aCgpfVxyXG4gICAgfSxcclxuICAgIF9wYXJzZVBpeGVsczogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KGEuY3NzKGIpLCAxMCkgfHwgMFxyXG4gICAgfSxcclxuICAgIF90cmlnZ2VyTW91c2VFdmVudDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGIgPSB0aGlzLl9wcmVwYXJlRXZlbnREYXRhKCk7XHJcbiAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKGEsIGIpXHJcbiAgICB9LFxyXG4gICAgX3ByZXBhcmVFdmVudERhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHtlbGVtZW50OiB0aGlzLmVsZW1lbnQsIG9mZnNldDogdGhpcy5jYWNoZS5vZmZzZXQgfHwgbnVsbH1cclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5yYW5nZVNsaWRlclwiLCB7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIGJvdW5kczoge21pbjogMCwgbWF4OiAxMDB9LFxyXG4gICAgICBkZWZhdWx0VmFsdWVzOiB7bWluOiAyMCwgbWF4OiA1MH0sXHJcbiAgICAgIHdoZWVsTW9kZTogbnVsbCxcclxuICAgICAgd2hlZWxTcGVlZDogNCxcclxuICAgICAgYXJyb3dzOiAhMCxcclxuICAgICAgdmFsdWVMYWJlbHM6IFwic2hvd1wiLFxyXG4gICAgICBmb3JtYXR0ZXI6IG51bGwsXHJcbiAgICAgIGR1cmF0aW9uSW46IDAsXHJcbiAgICAgIGR1cmF0aW9uT3V0OiA0MDAsXHJcbiAgICAgIGRlbGF5T3V0OiAyMDAsXHJcbiAgICAgIHJhbmdlOiB7bWluOiAhMSwgbWF4OiAhMX0sXHJcbiAgICAgIHN0ZXA6ICExLFxyXG4gICAgICBzY2FsZXM6ICExLFxyXG4gICAgICBlbmFibGVkOiAhMCxcclxuICAgICAgc3ltbWV0cmljUG9zaXRpb25uaW5nOiAhMVxyXG4gICAgfSxcclxuICAgIF92YWx1ZXM6IG51bGwsXHJcbiAgICBfdmFsdWVzQ2hhbmdlZDogITEsXHJcbiAgICBfaW5pdGlhbGl6ZWQ6ICExLFxyXG4gICAgYmFyOiBudWxsLFxyXG4gICAgbGVmdEhhbmRsZTogbnVsbCxcclxuICAgIHJpZ2h0SGFuZGxlOiBudWxsLFxyXG4gICAgaW5uZXJCYXI6IG51bGwsXHJcbiAgICBjb250YWluZXI6IG51bGwsXHJcbiAgICBhcnJvd3M6IG51bGwsXHJcbiAgICBsYWJlbHM6IG51bGwsXHJcbiAgICBjaGFuZ2luZzoge21pbjogITEsIG1heDogITF9LFxyXG4gICAgY2hhbmdlZDoge21pbjogITEsIG1heDogITF9LFxyXG4gICAgcnVsZXI6IG51bGwsXHJcbiAgICBfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3NldERlZmF1bHRWYWx1ZXMoKSwgdGhpcy5sYWJlbHMgPSB7XHJcbiAgICAgICAgbGVmdDogbnVsbCxcclxuICAgICAgICByaWdodDogbnVsbCxcclxuICAgICAgICBsZWZ0RGlzcGxheWVkOiAhMCxcclxuICAgICAgICByaWdodERpc3BsYXllZDogITBcclxuICAgICAgfSwgdGhpcy5hcnJvd3MgPSB7bGVmdDogbnVsbCwgcmlnaHQ6IG51bGx9LCB0aGlzLmNoYW5naW5nID0ge21pbjogITEsIG1heDogITF9LCB0aGlzLmNoYW5nZWQgPSB7XHJcbiAgICAgICAgbWluOiAhMSxcclxuICAgICAgICBtYXg6ICExXHJcbiAgICAgIH0sIHRoaXMuX2NyZWF0ZUVsZW1lbnRzKCksIHRoaXMuX2JpbmRSZXNpemUoKSwgc2V0VGltZW91dChhLnByb3h5KHRoaXMucmVzaXplLCB0aGlzKSwgMSksIHNldFRpbWVvdXQoYS5wcm94eSh0aGlzLl9pbml0VmFsdWVzLCB0aGlzKSwgMSlcclxuICAgIH0sXHJcbiAgICBfc2V0RGVmYXVsdFZhbHVlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl92YWx1ZXMgPSB7bWluOiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlcy5taW4sIG1heDogdGhpcy5vcHRpb25zLmRlZmF1bHRWYWx1ZXMubWF4fVxyXG4gICAgfSxcclxuICAgIF9iaW5kUmVzaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBiID0gdGhpcztcclxuICAgICAgdGhpcy5fcmVzaXplUHJveHkgPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgIGIucmVzaXplKGEpXHJcbiAgICAgIH0sIGEod2luZG93KS5yZXNpemUodGhpcy5fcmVzaXplUHJveHkpXHJcbiAgICB9LFxyXG4gICAgX2luaXRXaWR0aDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmNvbnRhaW5lci5jc3MoXCJ3aWR0aFwiLCB0aGlzLmVsZW1lbnQud2lkdGgoKSAtIHRoaXMuY29udGFpbmVyLm91dGVyV2lkdGgoITApICsgdGhpcy5jb250YWluZXIud2lkdGgoKSksIHRoaXMuaW5uZXJCYXIuY3NzKFwid2lkdGhcIiwgdGhpcy5jb250YWluZXIud2lkdGgoKSAtIHRoaXMuaW5uZXJCYXIub3V0ZXJXaWR0aCghMCkgKyB0aGlzLmlubmVyQmFyLndpZHRoKCkpXHJcbiAgICB9LFxyXG4gICAgX2luaXRWYWx1ZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSAhMCwgdGhpcy52YWx1ZXModGhpcy5fdmFsdWVzLm1pbiwgdGhpcy5fdmFsdWVzLm1heClcclxuICAgIH0sXHJcbiAgICBfc2V0T3B0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB0aGlzLl9zZXRXaGVlbE9wdGlvbihhLCBiKSwgdGhpcy5fc2V0QXJyb3dzT3B0aW9uKGEsIGIpLCB0aGlzLl9zZXRMYWJlbHNPcHRpb24oYSwgYiksIHRoaXMuX3NldExhYmVsc0R1cmF0aW9ucyhhLCBiKSwgdGhpcy5fc2V0Rm9ybWF0dGVyT3B0aW9uKGEsIGIpLCB0aGlzLl9zZXRCb3VuZHNPcHRpb24oYSwgYiksIHRoaXMuX3NldFJhbmdlT3B0aW9uKGEsIGIpLCB0aGlzLl9zZXRTdGVwT3B0aW9uKGEsIGIpLCB0aGlzLl9zZXRTY2FsZXNPcHRpb24oYSwgYiksIHRoaXMuX3NldEVuYWJsZWRPcHRpb24oYSwgYiksIHRoaXMuX3NldFBvc2l0aW9ubmluZ09wdGlvbihhLCBiKVxyXG4gICAgfSxcclxuICAgIF92YWxpZFByb3BlcnR5OiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICByZXR1cm4gbnVsbCA9PT0gYSB8fCBcInVuZGVmaW5lZFwiID09IHR5cGVvZiBhW2JdID8gYyA6IGFbYl1cclxuICAgIH0sXHJcbiAgICBfc2V0U3RlcE9wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgXCJzdGVwXCIgPT09IGEgJiYgKHRoaXMub3B0aW9ucy5zdGVwID0gYiwgdGhpcy5fbGVmdEhhbmRsZShcIm9wdGlvblwiLCBcInN0ZXBcIiwgYiksIHRoaXMuX3JpZ2h0SGFuZGxlKFwib3B0aW9uXCIsIFwic3RlcFwiLCBiKSwgdGhpcy5fY2hhbmdlZCghMCkpXHJcbiAgICB9LFxyXG4gICAgX3NldFNjYWxlc09wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgXCJzY2FsZXNcIiA9PT0gYSAmJiAoYiA9PT0gITEgfHwgbnVsbCA9PT0gYiA/ICh0aGlzLm9wdGlvbnMuc2NhbGVzID0gITEsIHRoaXMuX2Rlc3Ryb3lSdWxlcigpKSA6IGIgaW5zdGFuY2VvZiBBcnJheSAmJiAodGhpcy5vcHRpb25zLnNjYWxlcyA9IGIsIHRoaXMuX3VwZGF0ZVJ1bGVyKCkpKVxyXG4gICAgfSxcclxuICAgIF9zZXRSYW5nZU9wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgXCJyYW5nZVwiID09PSBhICYmICh0aGlzLl9iYXIoXCJvcHRpb25cIiwgXCJyYW5nZVwiLCBiKSwgdGhpcy5vcHRpb25zLnJhbmdlID0gdGhpcy5fYmFyKFwib3B0aW9uXCIsIFwicmFuZ2VcIiksIHRoaXMuX2NoYW5nZWQoITApKVxyXG4gICAgfSxcclxuICAgIF9zZXRCb3VuZHNPcHRpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIFwiYm91bmRzXCIgPT09IGEgJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYi5taW4gJiYgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYi5tYXggJiYgdGhpcy5ib3VuZHMoYi5taW4sIGIubWF4KVxyXG4gICAgfSxcclxuICAgIF9zZXRXaGVlbE9wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgKFwid2hlZWxNb2RlXCIgPT09IGEgfHwgXCJ3aGVlbFNwZWVkXCIgPT09IGEpICYmICh0aGlzLl9iYXIoXCJvcHRpb25cIiwgYSwgYiksIHRoaXMub3B0aW9uc1thXSA9IHRoaXMuX2JhcihcIm9wdGlvblwiLCBhKSlcclxuICAgIH0sXHJcbiAgICBfc2V0TGFiZWxzT3B0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBpZiAoXCJ2YWx1ZUxhYmVsc1wiID09PSBhKSB7XHJcbiAgICAgICAgaWYgKFwiaGlkZVwiICE9PSBiICYmIFwic2hvd1wiICE9PSBiICYmIFwiY2hhbmdlXCIgIT09IGIpcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy52YWx1ZUxhYmVscyA9IGIsIFwiaGlkZVwiICE9PSBiID8gKHRoaXMuX2NyZWF0ZUxhYmVscygpLCB0aGlzLl9sZWZ0TGFiZWwoXCJ1cGRhdGVcIiksIHRoaXMuX3JpZ2h0TGFiZWwoXCJ1cGRhdGVcIikpIDogdGhpcy5fZGVzdHJveUxhYmVscygpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfc2V0Rm9ybWF0dGVyT3B0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBcImZvcm1hdHRlclwiID09PSBhICYmIG51bGwgIT09IGIgJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBiICYmIFwiaGlkZVwiICE9PSB0aGlzLm9wdGlvbnMudmFsdWVMYWJlbHMgJiYgKHRoaXMuX2xlZnRMYWJlbChcIm9wdGlvblwiLCBcImZvcm1hdHRlclwiLCBiKSwgdGhpcy5vcHRpb25zLmZvcm1hdHRlciA9IHRoaXMuX3JpZ2h0TGFiZWwoXCJvcHRpb25cIiwgXCJmb3JtYXR0ZXJcIiwgYikpXHJcbiAgICB9LFxyXG4gICAgX3NldEFycm93c09wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgXCJhcnJvd3NcIiAhPT0gYSB8fCBiICE9PSAhMCAmJiBiICE9PSAhMSB8fCBiID09PSB0aGlzLm9wdGlvbnMuYXJyb3dzIHx8IChiID09PSAhMCA/ICh0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1ub0Fycm93XCIpLmFkZENsYXNzKFwidWktcmFuZ2VTbGlkZXItd2l0aEFycm93c1wiKSwgdGhpcy5hcnJvd3MubGVmdC5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIiksIHRoaXMuYXJyb3dzLnJpZ2h0LmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKSwgdGhpcy5vcHRpb25zLmFycm93cyA9ICEwKSA6IGIgPT09ICExICYmICh0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1ub0Fycm93XCIpLnJlbW92ZUNsYXNzKFwidWktcmFuZ2VTbGlkZXItd2l0aEFycm93c1wiKSwgdGhpcy5hcnJvd3MubGVmdC5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKSwgdGhpcy5hcnJvd3MucmlnaHQuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIiksIHRoaXMub3B0aW9ucy5hcnJvd3MgPSAhMSksIHRoaXMuX2luaXRXaWR0aCgpKVxyXG4gICAgfSxcclxuICAgIF9zZXRMYWJlbHNEdXJhdGlvbnM6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIGlmIChcImR1cmF0aW9uSW5cIiA9PT0gYSB8fCBcImR1cmF0aW9uT3V0XCIgPT09IGEgfHwgXCJkZWxheU91dFwiID09PSBhKSB7XHJcbiAgICAgICAgaWYgKHBhcnNlSW50KGIsIDEwKSAhPT0gYilyZXR1cm47XHJcbiAgICAgICAgbnVsbCAhPT0gdGhpcy5sYWJlbHMubGVmdCAmJiB0aGlzLl9sZWZ0TGFiZWwoXCJvcHRpb25cIiwgYSwgYiksIG51bGwgIT09IHRoaXMubGFiZWxzLnJpZ2h0ICYmIHRoaXMuX3JpZ2h0TGFiZWwoXCJvcHRpb25cIiwgYSwgYiksIHRoaXMub3B0aW9uc1thXSA9IGJcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9zZXRFbmFibGVkT3B0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBcImVuYWJsZWRcIiA9PT0gYSAmJiB0aGlzLnRvZ2dsZShiKVxyXG4gICAgfSxcclxuICAgIF9zZXRQb3NpdGlvbm5pbmdPcHRpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIFwic3ltbWV0cmljUG9zaXRpb25uaW5nXCIgPT09IGEgJiYgKHRoaXMuX3JpZ2h0SGFuZGxlKFwib3B0aW9uXCIsIGEsIGIpLCB0aGlzLm9wdGlvbnNbYV0gPSB0aGlzLl9sZWZ0SGFuZGxlKFwib3B0aW9uXCIsIGEsIGIpKVxyXG4gICAgfSxcclxuICAgIF9jcmVhdGVFbGVtZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICBcImFic29sdXRlXCIgIT09IHRoaXMuZWxlbWVudC5jc3MoXCJwb3NpdGlvblwiKSAmJiB0aGlzLmVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJyZWxhdGl2ZVwiKSwgdGhpcy5lbGVtZW50LmFkZENsYXNzKFwidWktcmFuZ2VTbGlkZXJcIiksIHRoaXMuY29udGFpbmVyID0gYShcIjxkaXYgY2xhc3M9J3VpLXJhbmdlU2xpZGVyLWNvbnRhaW5lcicgLz5cIikuY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpLCB0aGlzLmlubmVyQmFyID0gYShcIjxkaXYgY2xhc3M9J3VpLXJhbmdlU2xpZGVyLWlubmVyQmFyJyAvPlwiKS5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpLmNzcyhcInRvcFwiLCAwKS5jc3MoXCJsZWZ0XCIsIDApLCB0aGlzLl9jcmVhdGVIYW5kbGVzKCksIHRoaXMuX2NyZWF0ZUJhcigpLCB0aGlzLmNvbnRhaW5lci5wcmVwZW5kKHRoaXMuaW5uZXJCYXIpLCB0aGlzLl9jcmVhdGVBcnJvd3MoKSwgXCJoaWRlXCIgIT09IHRoaXMub3B0aW9ucy52YWx1ZUxhYmVscyA/IHRoaXMuX2NyZWF0ZUxhYmVscygpIDogdGhpcy5fZGVzdHJveUxhYmVscygpLCB0aGlzLl91cGRhdGVSdWxlcigpLCB0aGlzLm9wdGlvbnMuZW5hYmxlZCB8fCB0aGlzLl90b2dnbGUodGhpcy5vcHRpb25zLmVuYWJsZWQpXHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUhhbmRsZTogZnVuY3Rpb24gKGIpIHtcclxuICAgICAgcmV0dXJuIGEoXCI8ZGl2IC8+XCIpW3RoaXMuX2hhbmRsZVR5cGUoKV0oYikuYmluZChcInNsaWRlckRyYWdcIiwgYS5wcm94eSh0aGlzLl9jaGFuZ2luZywgdGhpcykpLmJpbmQoXCJzdG9wXCIsIGEucHJveHkodGhpcy5fY2hhbmdlZCwgdGhpcykpXHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUhhbmRsZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5sZWZ0SGFuZGxlID0gdGhpcy5fY3JlYXRlSGFuZGxlKHtcclxuICAgICAgICBpc0xlZnQ6ICEwLFxyXG4gICAgICAgIGJvdW5kczogdGhpcy5vcHRpb25zLmJvdW5kcyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5fdmFsdWVzLm1pbixcclxuICAgICAgICBzdGVwOiB0aGlzLm9wdGlvbnMuc3RlcCxcclxuICAgICAgICBzeW1tZXRyaWNQb3NpdGlvbm5pbmc6IHRoaXMub3B0aW9ucy5zeW1tZXRyaWNQb3NpdGlvbm5pbmdcclxuICAgICAgfSkuYXBwZW5kVG8odGhpcy5jb250YWluZXIpLCB0aGlzLnJpZ2h0SGFuZGxlID0gdGhpcy5fY3JlYXRlSGFuZGxlKHtcclxuICAgICAgICBpc0xlZnQ6ICExLFxyXG4gICAgICAgIGJvdW5kczogdGhpcy5vcHRpb25zLmJvdW5kcyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5fdmFsdWVzLm1heCxcclxuICAgICAgICBzdGVwOiB0aGlzLm9wdGlvbnMuc3RlcCxcclxuICAgICAgICBzeW1tZXRyaWNQb3NpdGlvbm5pbmc6IHRoaXMub3B0aW9ucy5zeW1tZXRyaWNQb3NpdGlvbm5pbmdcclxuICAgICAgfSkuYXBwZW5kVG8odGhpcy5jb250YWluZXIpXHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUJhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmJhciA9IGEoXCI8ZGl2IC8+XCIpLnByZXBlbmRUbyh0aGlzLmNvbnRhaW5lcikuYmluZChcInNsaWRlckRyYWcgc2Nyb2xsIHpvb21cIiwgYS5wcm94eSh0aGlzLl9jaGFuZ2luZywgdGhpcykpLmJpbmQoXCJzdG9wXCIsIGEucHJveHkodGhpcy5fY2hhbmdlZCwgdGhpcykpLCB0aGlzLl9iYXIoe1xyXG4gICAgICAgIGxlZnRIYW5kbGU6IHRoaXMubGVmdEhhbmRsZSxcclxuICAgICAgICByaWdodEhhbmRsZTogdGhpcy5yaWdodEhhbmRsZSxcclxuICAgICAgICB2YWx1ZXM6IHttaW46IHRoaXMuX3ZhbHVlcy5taW4sIG1heDogdGhpcy5fdmFsdWVzLm1heH0sXHJcbiAgICAgICAgdHlwZTogdGhpcy5faGFuZGxlVHlwZSgpLFxyXG4gICAgICAgIHJhbmdlOiB0aGlzLm9wdGlvbnMucmFuZ2UsXHJcbiAgICAgICAgd2hlZWxNb2RlOiB0aGlzLm9wdGlvbnMud2hlZWxNb2RlLFxyXG4gICAgICAgIHdoZWVsU3BlZWQ6IHRoaXMub3B0aW9ucy53aGVlbFNwZWVkXHJcbiAgICAgIH0pLCB0aGlzLm9wdGlvbnMucmFuZ2UgPSB0aGlzLl9iYXIoXCJvcHRpb25cIiwgXCJyYW5nZVwiKSwgdGhpcy5vcHRpb25zLndoZWVsTW9kZSA9IHRoaXMuX2JhcihcIm9wdGlvblwiLCBcIndoZWVsTW9kZVwiKSwgdGhpcy5vcHRpb25zLndoZWVsU3BlZWQgPSB0aGlzLl9iYXIoXCJvcHRpb25cIiwgXCJ3aGVlbFNwZWVkXCIpXHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUFycm93czogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmFycm93cy5sZWZ0ID0gdGhpcy5fY3JlYXRlQXJyb3coXCJsZWZ0XCIpLCB0aGlzLmFycm93cy5yaWdodCA9IHRoaXMuX2NyZWF0ZUFycm93KFwicmlnaHRcIiksIHRoaXMub3B0aW9ucy5hcnJvd3MgPyB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci13aXRoQXJyb3dzXCIpIDogKHRoaXMuYXJyb3dzLmxlZnQuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIiksIHRoaXMuYXJyb3dzLnJpZ2h0LmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpLCB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1ub0Fycm93XCIpKVxyXG4gICAgfSxcclxuICAgIF9jcmVhdGVBcnJvdzogZnVuY3Rpb24gKGIpIHtcclxuICAgICAgdmFyIGMsXHJcbiAgICAgICAgZCA9IGEoXCI8ZGl2IGNsYXNzPSd1aS1yYW5nZVNsaWRlci1hcnJvdycgLz5cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndWktcmFuZ2VTbGlkZXItYXJyb3ctaW5uZXInIC8+XCIpLmFkZENsYXNzKFwidWktcmFuZ2VTbGlkZXItXCIgKyBiICsgXCJBcnJvd1wiKS5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpLmNzcyhiLCAwKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xyXG4gICAgICByZXR1cm4gYyA9IFwicmlnaHRcIiA9PT0gYiA/IGEucHJveHkodGhpcy5fc2Nyb2xsUmlnaHRDbGljaywgdGhpcykgOiBhLnByb3h5KHRoaXMuX3Njcm9sbExlZnRDbGljaywgdGhpcyksIGQuYmluZChcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCIsIGMpLCBkXHJcbiAgICB9LFxyXG4gICAgX3Byb3h5OiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICB2YXIgZCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGMpO1xyXG4gICAgICByZXR1cm4gYSAmJiBhW2JdID8gYVtiXS5hcHBseShhLCBkKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBfaGFuZGxlVHlwZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gXCJyYW5nZVNsaWRlckhhbmRsZVwiXHJcbiAgICB9LFxyXG4gICAgX2JhclR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFwicmFuZ2VTbGlkZXJCYXJcIlxyXG4gICAgfSxcclxuICAgIF9iYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Byb3h5KHRoaXMuYmFyLCB0aGlzLl9iYXJUeXBlKCksIGFyZ3VtZW50cylcclxuICAgIH0sXHJcbiAgICBfbGFiZWxUeXBlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBcInJhbmdlU2xpZGVyTGFiZWxcIlxyXG4gICAgfSxcclxuICAgIF9sZWZ0TGFiZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Byb3h5KHRoaXMubGFiZWxzLmxlZnQsIHRoaXMuX2xhYmVsVHlwZSgpLCBhcmd1bWVudHMpXHJcbiAgICB9LFxyXG4gICAgX3JpZ2h0TGFiZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Byb3h5KHRoaXMubGFiZWxzLnJpZ2h0LCB0aGlzLl9sYWJlbFR5cGUoKSwgYXJndW1lbnRzKVxyXG4gICAgfSxcclxuICAgIF9sZWZ0SGFuZGxlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wcm94eSh0aGlzLmxlZnRIYW5kbGUsIHRoaXMuX2hhbmRsZVR5cGUoKSwgYXJndW1lbnRzKVxyXG4gICAgfSxcclxuICAgIF9yaWdodEhhbmRsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcHJveHkodGhpcy5yaWdodEhhbmRsZSwgdGhpcy5faGFuZGxlVHlwZSgpLCBhcmd1bWVudHMpXHJcbiAgICB9LFxyXG4gICAgX2dldFZhbHVlOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gYiA9PT0gdGhpcy5yaWdodEhhbmRsZSAmJiAoYSAtPSBiLm91dGVyV2lkdGgoKSksIGEgKiAodGhpcy5vcHRpb25zLmJvdW5kcy5tYXggLSB0aGlzLm9wdGlvbnMuYm91bmRzLm1pbikgLyAodGhpcy5jb250YWluZXIuaW5uZXJXaWR0aCgpIC0gYi5vdXRlcldpZHRoKCEwKSkgKyB0aGlzLm9wdGlvbnMuYm91bmRzLm1pblxyXG4gICAgfSxcclxuICAgIF90cmlnZ2VyOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGIuZWxlbWVudC50cmlnZ2VyKGEsIHtsYWJlbDogYi5lbGVtZW50LCB2YWx1ZXM6IGIudmFsdWVzKCl9KVxyXG4gICAgICB9LCAxKVxyXG4gICAgfSxcclxuICAgIF9jaGFuZ2luZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZXMoKSAmJiAodGhpcy5fdHJpZ2dlcihcInZhbHVlc0NoYW5naW5nXCIpLCB0aGlzLl92YWx1ZXNDaGFuZ2VkID0gITApXHJcbiAgICB9LFxyXG4gICAgX2RlYWN0aXZhdGVMYWJlbHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgXCJjaGFuZ2VcIiA9PT0gdGhpcy5vcHRpb25zLnZhbHVlTGFiZWxzICYmICh0aGlzLl9sZWZ0TGFiZWwoXCJvcHRpb25cIiwgXCJzaG93XCIsIFwiaGlkZVwiKSwgdGhpcy5fcmlnaHRMYWJlbChcIm9wdGlvblwiLCBcInNob3dcIiwgXCJoaWRlXCIpKVxyXG4gICAgfSxcclxuICAgIF9yZWFjdGl2YXRlTGFiZWxzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFwiY2hhbmdlXCIgPT09IHRoaXMub3B0aW9ucy52YWx1ZUxhYmVscyAmJiAodGhpcy5fbGVmdExhYmVsKFwib3B0aW9uXCIsIFwic2hvd1wiLCBcImNoYW5nZVwiKSwgdGhpcy5fcmlnaHRMYWJlbChcIm9wdGlvblwiLCBcInNob3dcIiwgXCJjaGFuZ2VcIikpXHJcbiAgICB9LFxyXG4gICAgX2NoYW5nZWQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIGEgPT09ICEwICYmIHRoaXMuX2RlYWN0aXZhdGVMYWJlbHMoKSwgKHRoaXMuX3VwZGF0ZVZhbHVlcygpIHx8IHRoaXMuX3ZhbHVlc0NoYW5nZWQpICYmICh0aGlzLl90cmlnZ2VyKFwidmFsdWVzQ2hhbmdlZFwiKSwgYSAhPT0gITAgJiYgdGhpcy5fdHJpZ2dlcihcInVzZXJWYWx1ZXNDaGFuZ2VkXCIpLCB0aGlzLl92YWx1ZXNDaGFuZ2VkID0gITEpLCBhID09PSAhMCAmJiB0aGlzLl9yZWFjdGl2YXRlTGFiZWxzKClcclxuICAgIH0sXHJcbiAgICBfdXBkYXRlVmFsdWVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBhID0gdGhpcy5fbGVmdEhhbmRsZShcInZhbHVlXCIpLCBiID0gdGhpcy5fcmlnaHRIYW5kbGUoXCJ2YWx1ZVwiKSwgYyA9IHRoaXMuX21pbihhLCBiKSwgZCA9IHRoaXMuX21heChhLCBiKSxcclxuICAgICAgICBlID0gYyAhPT0gdGhpcy5fdmFsdWVzLm1pbiB8fCBkICE9PSB0aGlzLl92YWx1ZXMubWF4O1xyXG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWVzLm1pbiA9IHRoaXMuX21pbihhLCBiKSwgdGhpcy5fdmFsdWVzLm1heCA9IHRoaXMuX21heChhLCBiKSwgZVxyXG4gICAgfSxcclxuICAgIF9taW46IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1pbihhLCBiKVxyXG4gICAgfSxcclxuICAgIF9tYXg6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1heChhLCBiKVxyXG4gICAgfSxcclxuICAgIF9jcmVhdGVMYWJlbDogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgdmFyIGQ7XHJcbiAgICAgIHJldHVybiBudWxsID09PSBiID8gKGQgPSB0aGlzLl9nZXRMYWJlbENvbnN0cnVjdG9yUGFyYW1ldGVycyhiLCBjKSwgYiA9IGEoXCI8ZGl2IC8+XCIpLmFwcGVuZFRvKHRoaXMuZWxlbWVudClbdGhpcy5fbGFiZWxUeXBlKCldKGQpKSA6IChkID0gdGhpcy5fZ2V0TGFiZWxSZWZyZXNoUGFyYW1ldGVycyhiLCBjKSwgYlt0aGlzLl9sYWJlbFR5cGUoKV0oZCkpLCBiXHJcbiAgICB9LFxyXG4gICAgX2dldExhYmVsQ29uc3RydWN0b3JQYXJhbWV0ZXJzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhhbmRsZTogYixcclxuICAgICAgICBoYW5kbGVUeXBlOiB0aGlzLl9oYW5kbGVUeXBlKCksXHJcbiAgICAgICAgZm9ybWF0dGVyOiB0aGlzLl9nZXRGb3JtYXR0ZXIoKSxcclxuICAgICAgICBzaG93OiB0aGlzLm9wdGlvbnMudmFsdWVMYWJlbHMsXHJcbiAgICAgICAgZHVyYXRpb25JbjogdGhpcy5vcHRpb25zLmR1cmF0aW9uSW4sXHJcbiAgICAgICAgZHVyYXRpb25PdXQ6IHRoaXMub3B0aW9ucy5kdXJhdGlvbk91dCxcclxuICAgICAgICBkZWxheU91dDogdGhpcy5vcHRpb25zLmRlbGF5T3V0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfZ2V0TGFiZWxSZWZyZXNoUGFyYW1ldGVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGZvcm1hdHRlcjogdGhpcy5fZ2V0Rm9ybWF0dGVyKCksXHJcbiAgICAgICAgc2hvdzogdGhpcy5vcHRpb25zLnZhbHVlTGFiZWxzLFxyXG4gICAgICAgIGR1cmF0aW9uSW46IHRoaXMub3B0aW9ucy5kdXJhdGlvbkluLFxyXG4gICAgICAgIGR1cmF0aW9uT3V0OiB0aGlzLm9wdGlvbnMuZHVyYXRpb25PdXQsXHJcbiAgICAgICAgZGVsYXlPdXQ6IHRoaXMub3B0aW9ucy5kZWxheU91dFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgX2dldEZvcm1hdHRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZvcm1hdHRlciA9PT0gITEgfHwgbnVsbCA9PT0gdGhpcy5vcHRpb25zLmZvcm1hdHRlciA/IHRoaXMuX2RlZmF1bHRGb3JtYXR0ZXIgOiB0aGlzLm9wdGlvbnMuZm9ybWF0dGVyXHJcbiAgICB9LFxyXG4gICAgX2RlZmF1bHRGb3JtYXR0ZXI6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKGEpXHJcbiAgICB9LFxyXG4gICAgX2Rlc3Ryb3lMYWJlbDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIG51bGwgIT09IGEgJiYgKGFbdGhpcy5fbGFiZWxUeXBlKCldKFwiZGVzdHJveVwiKSwgYS5yZW1vdmUoKSwgYSA9IG51bGwpLCBhXHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZUxhYmVsczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmxhYmVscy5sZWZ0ID0gdGhpcy5fY3JlYXRlTGFiZWwodGhpcy5sYWJlbHMubGVmdCwgdGhpcy5sZWZ0SGFuZGxlKSwgdGhpcy5sYWJlbHMucmlnaHQgPSB0aGlzLl9jcmVhdGVMYWJlbCh0aGlzLmxhYmVscy5yaWdodCwgdGhpcy5yaWdodEhhbmRsZSksIHRoaXMuX2xlZnRMYWJlbChcInBhaXJcIiwgdGhpcy5sYWJlbHMucmlnaHQpXHJcbiAgICB9LFxyXG4gICAgX2Rlc3Ryb3lMYWJlbHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5sYWJlbHMubGVmdCA9IHRoaXMuX2Rlc3Ryb3lMYWJlbCh0aGlzLmxhYmVscy5sZWZ0KSwgdGhpcy5sYWJlbHMucmlnaHQgPSB0aGlzLl9kZXN0cm95TGFiZWwodGhpcy5sYWJlbHMucmlnaHQpXHJcbiAgICB9LFxyXG4gICAgX3N0ZXBSYXRpbzogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fbGVmdEhhbmRsZShcInN0ZXBSYXRpb1wiKVxyXG4gICAgfSxcclxuICAgIF9zY3JvbGxSaWdodENsaWNrOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmVuYWJsZWQgPyAoYS5wcmV2ZW50RGVmYXVsdCgpLCB0aGlzLl9iYXIoXCJzdGFydFNjcm9sbFwiKSwgdGhpcy5fYmluZFN0b3BTY3JvbGwoKSwgdm9pZCB0aGlzLl9jb250aW51ZVNjcm9sbGluZyhcInNjcm9sbFJpZ2h0XCIsIDQgKiB0aGlzLl9zdGVwUmF0aW8oKSwgMSkpIDogITFcclxuICAgIH0sXHJcbiAgICBfY29udGludWVTY3JvbGxpbmc6IGZ1bmN0aW9uIChhLCBiLCBjLCBkKSB7XHJcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmVuYWJsZWQpcmV0dXJuICExO1xyXG4gICAgICB0aGlzLl9iYXIoYSwgYyksIGQgPSBkIHx8IDUsIGQtLTtcclxuICAgICAgdmFyIGUgPSB0aGlzLCBmID0gMTYsIGcgPSBNYXRoLm1heCgxLCA0IC8gdGhpcy5fc3RlcFJhdGlvKCkpO1xyXG4gICAgICB0aGlzLl9zY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgMCA9PT0gZCAmJiAoYiA+IGYgPyBiID0gTWF0aC5tYXgoZiwgYiAvIDEuNSkgOiBjID0gTWF0aC5taW4oZywgMiAqIGMpLCBkID0gNSksIGUuX2NvbnRpbnVlU2Nyb2xsaW5nKGEsIGIsIGMsIGQpXHJcbiAgICAgIH0sIGIpXHJcbiAgICB9LFxyXG4gICAgX3Njcm9sbExlZnRDbGljazogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5lbmFibGVkID8gKGEucHJldmVudERlZmF1bHQoKSwgdGhpcy5fYmFyKFwic3RhcnRTY3JvbGxcIiksIHRoaXMuX2JpbmRTdG9wU2Nyb2xsKCksIHZvaWQgdGhpcy5fY29udGludWVTY3JvbGxpbmcoXCJzY3JvbGxMZWZ0XCIsIDQgKiB0aGlzLl9zdGVwUmF0aW8oKSwgMSkpIDogITFcclxuICAgIH0sXHJcbiAgICBfYmluZFN0b3BTY3JvbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGIgPSB0aGlzO1xyXG4gICAgICB0aGlzLl9zdG9wU2Nyb2xsSGFuZGxlID0gZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICBhLnByZXZlbnREZWZhdWx0KCksIGIuX3N0b3BTY3JvbGwoKVxyXG4gICAgICB9LCBhKGRvY3VtZW50KS5iaW5kKFwibW91c2V1cCB0b3VjaGVuZFwiLCB0aGlzLl9zdG9wU2Nyb2xsSGFuZGxlKVxyXG4gICAgfSxcclxuICAgIF9zdG9wU2Nyb2xsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGEoZG9jdW1lbnQpLnVuYmluZChcIm1vdXNldXAgdG91Y2hlbmRcIiwgdGhpcy5fc3RvcFNjcm9sbEhhbmRsZSksIHRoaXMuX3N0b3BTY3JvbGxIYW5kbGUgPSBudWxsLCB0aGlzLl9iYXIoXCJzdG9wU2Nyb2xsXCIpLCBjbGVhclRpbWVvdXQodGhpcy5fc2Nyb2xsVGltZW91dClcclxuICAgIH0sXHJcbiAgICBfY3JlYXRlUnVsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5ydWxlciA9IGEoXCI8ZGl2IGNsYXNzPSd1aS1yYW5nZVNsaWRlci1ydWxlcicgLz5cIikuYXBwZW5kVG8odGhpcy5pbm5lckJhcilcclxuICAgIH0sXHJcbiAgICBfc2V0UnVsZXJQYXJhbWV0ZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMucnVsZXIucnVsZXIoe21pbjogdGhpcy5vcHRpb25zLmJvdW5kcy5taW4sIG1heDogdGhpcy5vcHRpb25zLmJvdW5kcy5tYXgsIHNjYWxlczogdGhpcy5vcHRpb25zLnNjYWxlc30pXHJcbiAgICB9LFxyXG4gICAgX2Rlc3Ryb3lSdWxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICBudWxsICE9PSB0aGlzLnJ1bGVyICYmIGEuZm4ucnVsZXIgJiYgKHRoaXMucnVsZXIucnVsZXIoXCJkZXN0cm95XCIpLCB0aGlzLnJ1bGVyLnJlbW92ZSgpLCB0aGlzLnJ1bGVyID0gbnVsbClcclxuICAgIH0sXHJcbiAgICBfdXBkYXRlUnVsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fZGVzdHJveVJ1bGVyKCksIHRoaXMub3B0aW9ucy5zY2FsZXMgIT09ICExICYmIGEuZm4ucnVsZXIgJiYgKHRoaXMuX2NyZWF0ZVJ1bGVyKCksIHRoaXMuX3NldFJ1bGVyUGFyYW1ldGVycygpKVxyXG4gICAgfSxcclxuICAgIHZhbHVlczogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgdmFyIGM7XHJcbiAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBhICYmIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKXJldHVybiB0aGlzLl92YWx1ZXMubWluID0gYSwgdGhpcy5fdmFsdWVzLm1heCA9IGIsIHRoaXMuX3ZhbHVlcztcclxuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlTGFiZWxzKCksIGMgPSB0aGlzLl9iYXIoXCJ2YWx1ZXNcIiwgYSwgYiksIHRoaXMuX2NoYW5nZWQoITApLCB0aGlzLl9yZWFjdGl2YXRlTGFiZWxzKClcclxuICAgICAgfSBlbHNlIGMgPSB0aGlzLl9iYXIoXCJ2YWx1ZXNcIiwgYSwgYik7XHJcbiAgICAgIHJldHVybiBjXHJcbiAgICB9LFxyXG4gICAgbWluOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fdmFsdWVzLm1pbiA9IHRoaXMudmFsdWVzKGEsIHRoaXMuX3ZhbHVlcy5tYXgpLm1pbiwgdGhpcy5fdmFsdWVzLm1pblxyXG4gICAgfSxcclxuICAgIG1heDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlcy5tYXggPSB0aGlzLnZhbHVlcyh0aGlzLl92YWx1ZXMubWluLCBhKS5tYXgsIHRoaXMuX3ZhbHVlcy5tYXhcclxuICAgIH0sXHJcbiAgICBib3VuZHM6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkVmFsdWUoYSkgJiYgdGhpcy5faXNWYWxpZFZhbHVlKGIpICYmIGIgPiBhICYmICh0aGlzLl9zZXRCb3VuZHMoYSwgYiksIHRoaXMuX3VwZGF0ZVJ1bGVyKCksIHRoaXMuX2NoYW5nZWQoITApKSwgdGhpcy5vcHRpb25zLmJvdW5kc1xyXG4gICAgfSxcclxuICAgIF9pc1ZhbGlkVmFsdWU6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBhICYmIHBhcnNlRmxvYXQoYSkgPT09IGFcclxuICAgIH0sXHJcbiAgICBfc2V0Qm91bmRzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuYm91bmRzID0ge1xyXG4gICAgICAgIG1pbjogYSxcclxuICAgICAgICBtYXg6IGJcclxuICAgICAgfSwgdGhpcy5fbGVmdEhhbmRsZShcIm9wdGlvblwiLCBcImJvdW5kc1wiLCB0aGlzLm9wdGlvbnMuYm91bmRzKSwgdGhpcy5fcmlnaHRIYW5kbGUoXCJvcHRpb25cIiwgXCJib3VuZHNcIiwgdGhpcy5vcHRpb25zLmJvdW5kcyksIHRoaXMuX2JhcihcIm9wdGlvblwiLCBcImJvdW5kc1wiLCB0aGlzLm9wdGlvbnMuYm91bmRzKVxyXG4gICAgfSxcclxuICAgIHpvb21JbjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdGhpcy5fYmFyKFwiem9vbUluXCIsIGEpXHJcbiAgICB9LFxyXG4gICAgem9vbU91dDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdGhpcy5fYmFyKFwiem9vbU91dFwiLCBhKVxyXG4gICAgfSxcclxuICAgIHNjcm9sbExlZnQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMuX2JhcihcInN0YXJ0U2Nyb2xsXCIpLCB0aGlzLl9iYXIoXCJzY3JvbGxMZWZ0XCIsIGEpLCB0aGlzLl9iYXIoXCJzdG9wU2Nyb2xsXCIpXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsUmlnaHQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMuX2JhcihcInN0YXJ0U2Nyb2xsXCIpLCB0aGlzLl9iYXIoXCJzY3JvbGxSaWdodFwiLCBhKSwgdGhpcy5fYmFyKFwic3RvcFNjcm9sbFwiKVxyXG4gICAgfSxcclxuICAgIHJlc2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmNvbnRhaW5lciAmJiAodGhpcy5faW5pdFdpZHRoKCksIHRoaXMuX2xlZnRIYW5kbGUoXCJ1cGRhdGVcIiksIHRoaXMuX3JpZ2h0SGFuZGxlKFwidXBkYXRlXCIpLCB0aGlzLl9iYXIoXCJ1cGRhdGVcIikpXHJcbiAgICB9LFxyXG4gICAgZW5hYmxlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMudG9nZ2xlKCEwKVxyXG4gICAgfSxcclxuICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy50b2dnbGUoITEpXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBhID09PSBiICYmIChhID0gIXRoaXMub3B0aW9ucy5lbmFibGVkKSwgdGhpcy5vcHRpb25zLmVuYWJsZWQgIT09IGEgJiYgdGhpcy5fdG9nZ2xlKGEpXHJcbiAgICB9LFxyXG4gICAgX3RvZ2dsZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLmVuYWJsZWQgPSBhLCB0aGlzLmVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1kaXNhYmxlZFwiLCAhYSk7XHJcbiAgICAgIHZhciBiID0gYSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIjtcclxuICAgICAgdGhpcy5fYmFyKGIpLCB0aGlzLl9sZWZ0SGFuZGxlKGIpLCB0aGlzLl9yaWdodEhhbmRsZShiKSwgdGhpcy5fbGVmdExhYmVsKGIpLCB0aGlzLl9yaWdodExhYmVsKGIpXHJcbiAgICB9LFxyXG4gICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci13aXRoQXJyb3dzIHVpLXJhbmdlU2xpZGVyLW5vQXJyb3cgdWktcmFuZ2VTbGlkZXItZGlzYWJsZWRcIiksIHRoaXMuX2Rlc3Ryb3lXaWRnZXRzKCksIHRoaXMuX2Rlc3Ryb3lFbGVtZW50cygpLCB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlclwiKSwgdGhpcy5vcHRpb25zID0gbnVsbCwgYSh3aW5kb3cpLnVuYmluZChcInJlc2l6ZVwiLCB0aGlzLl9yZXNpemVQcm94eSksIHRoaXMuX3Jlc2l6ZVByb3h5ID0gbnVsbCwgdGhpcy5fYmluZFJlc2l6ZSA9IG51bGwsIGEuV2lkZ2V0LnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuICAgIH0sXHJcbiAgICBfZGVzdHJveVdpZGdldDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdGhpc1tcIl9cIiArIGFdKFwiZGVzdHJveVwiKSwgdGhpc1thXS5yZW1vdmUoKSwgdGhpc1thXSA9IG51bGxcclxuICAgIH0sXHJcbiAgICBfZGVzdHJveVdpZGdldHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fZGVzdHJveVdpZGdldChcImJhclwiKSwgdGhpcy5fZGVzdHJveVdpZGdldChcImxlZnRIYW5kbGVcIiksIHRoaXMuX2Rlc3Ryb3lXaWRnZXQoXCJyaWdodEhhbmRsZVwiKSwgdGhpcy5fZGVzdHJveVJ1bGVyKCksIHRoaXMuX2Rlc3Ryb3lMYWJlbHMoKVxyXG4gICAgfSxcclxuICAgIF9kZXN0cm95RWxlbWVudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCksIHRoaXMuY29udGFpbmVyID0gbnVsbCwgdGhpcy5pbm5lckJhci5yZW1vdmUoKSwgdGhpcy5pbm5lckJhciA9IG51bGwsIHRoaXMuYXJyb3dzLmxlZnQucmVtb3ZlKCksIHRoaXMuYXJyb3dzLnJpZ2h0LnJlbW92ZSgpLCB0aGlzLmFycm93cyA9IG51bGxcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5yYW5nZVNsaWRlckhhbmRsZVwiLCBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLCB7XHJcbiAgICBjdXJyZW50TW92ZTogbnVsbCxcclxuICAgIG1hcmdpbjogMCxcclxuICAgIHBhcmVudEVsZW1lbnQ6IG51bGwsXHJcbiAgICBvcHRpb25zOiB7aXNMZWZ0OiAhMCwgYm91bmRzOiB7bWluOiAwLCBtYXg6IDEwMH0sIHJhbmdlOiAhMSwgdmFsdWU6IDAsIHN0ZXA6ICExfSxcclxuICAgIF92YWx1ZTogMCxcclxuICAgIF9sZWZ0OiAwLFxyXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5fY3JlYXRlLmFwcGx5KHRoaXMpLCB0aGlzLmVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKS5jc3MoXCJ0b3BcIiwgMCkuYWRkQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1oYW5kbGVcIikudG9nZ2xlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1sZWZ0SGFuZGxlXCIsIHRoaXMub3B0aW9ucy5pc0xlZnQpLnRvZ2dsZUNsYXNzKFwidWktcmFuZ2VTbGlkZXItcmlnaHRIYW5kbGVcIiwgIXRoaXMub3B0aW9ucy5pc0xlZnQpLCB0aGlzLmVsZW1lbnQuYXBwZW5kKFwiPGRpdiBjbGFzcz0ndWktcmFuZ2VTbGlkZXItaGFuZGxlLWlubmVyJyAvPlwiKSwgdGhpcy5fdmFsdWUgPSB0aGlzLl9jb25zdHJhaW50VmFsdWUodGhpcy5vcHRpb25zLnZhbHVlKVxyXG4gICAgfSxcclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LmVtcHR5KCksIGEudWkucmFuZ2VTbGlkZXJEcmFnZ2FibGUucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcylcclxuICAgIH0sXHJcbiAgICBfc2V0T3B0aW9uOiBmdW5jdGlvbiAoYiwgYykge1xyXG4gICAgICBcImlzTGVmdFwiICE9PSBiIHx8IGMgIT09ICEwICYmIGMgIT09ICExIHx8IGMgPT09IHRoaXMub3B0aW9ucy5pc0xlZnQgPyBcInN0ZXBcIiA9PT0gYiAmJiB0aGlzLl9jaGVja1N0ZXAoYykgPyAodGhpcy5vcHRpb25zLnN0ZXAgPSBjLCB0aGlzLnVwZGF0ZSgpKSA6IFwiYm91bmRzXCIgPT09IGIgPyAodGhpcy5vcHRpb25zLmJvdW5kcyA9IGMsIHRoaXMudXBkYXRlKCkpIDogXCJyYW5nZVwiID09PSBiICYmIHRoaXMuX2NoZWNrUmFuZ2UoYykgPyAodGhpcy5vcHRpb25zLnJhbmdlID0gYywgdGhpcy51cGRhdGUoKSkgOiBcInN5bW1ldHJpY1Bvc2l0aW9ubmluZ1wiID09PSBiICYmICh0aGlzLm9wdGlvbnMuc3ltbWV0cmljUG9zaXRpb25uaW5nID0gYyA9PT0gITAsIHRoaXMudXBkYXRlKCkpIDogKHRoaXMub3B0aW9ucy5pc0xlZnQgPSBjLCB0aGlzLmVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1sZWZ0SGFuZGxlXCIsIHRoaXMub3B0aW9ucy5pc0xlZnQpLnRvZ2dsZUNsYXNzKFwidWktcmFuZ2VTbGlkZXItcmlnaHRIYW5kbGVcIiwgIXRoaXMub3B0aW9ucy5pc0xlZnQpLCB0aGlzLl9wb3NpdGlvbih0aGlzLl92YWx1ZSksIHRoaXMuZWxlbWVudC50cmlnZ2VyKFwic3dpdGNoXCIsIHRoaXMub3B0aW9ucy5pc0xlZnQpKSwgYS51aS5yYW5nZVNsaWRlckRyYWdnYWJsZS5wcm90b3R5cGUuX3NldE9wdGlvbi5hcHBseSh0aGlzLCBbYiwgY10pXHJcbiAgICB9LFxyXG4gICAgX2NoZWNrUmFuZ2U6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiBhID09PSAhMSB8fCAhdGhpcy5faXNWYWxpZFZhbHVlKGEubWluKSAmJiAhdGhpcy5faXNWYWxpZFZhbHVlKGEubWF4KVxyXG4gICAgfSxcclxuICAgIF9pc1ZhbGlkVmFsdWU6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBhICYmIGEgIT09ICExICYmIHBhcnNlRmxvYXQoYSkgIT09IGFcclxuICAgIH0sXHJcbiAgICBfY2hlY2tTdGVwOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gYSA9PT0gITEgfHwgcGFyc2VGbG9hdChhKSA9PT0gYVxyXG4gICAgfSxcclxuICAgIF9pbml0RWxlbWVudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5faW5pdEVsZW1lbnQuYXBwbHkodGhpcyksIDAgPT09IHRoaXMuY2FjaGUucGFyZW50LndpZHRoIHx8IG51bGwgPT09IHRoaXMuY2FjaGUucGFyZW50LndpZHRoID8gc2V0VGltZW91dChhLnByb3h5KHRoaXMuX2luaXRFbGVtZW50SWZOb3REZXN0cm95ZWQsIHRoaXMpLCA1MDApIDogKHRoaXMuX3Bvc2l0aW9uKHRoaXMuX3ZhbHVlKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJpbml0aWFsaXplXCIpKVxyXG4gICAgfSxcclxuICAgIF9ib3VuZHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5ib3VuZHNcclxuICAgIH0sXHJcbiAgICBfY2FjaGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlckRyYWdnYWJsZS5wcm90b3R5cGUuX2NhY2hlLmFwcGx5KHRoaXMpLCB0aGlzLl9jYWNoZVBhcmVudCgpXHJcbiAgICB9LFxyXG4gICAgX2NhY2hlUGFyZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBhID0gdGhpcy5lbGVtZW50LnBhcmVudCgpO1xyXG4gICAgICB0aGlzLmNhY2hlLnBhcmVudCA9IHtcclxuICAgICAgICBlbGVtZW50OiBhLFxyXG4gICAgICAgIG9mZnNldDogYS5vZmZzZXQoKSxcclxuICAgICAgICBwYWRkaW5nOiB7bGVmdDogdGhpcy5fcGFyc2VQaXhlbHMoYSwgXCJwYWRkaW5nTGVmdFwiKX0sXHJcbiAgICAgICAgd2lkdGg6IGEud2lkdGgoKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgX3Bvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHRoaXMuX2dldFBvc2l0aW9uRm9yVmFsdWUoYSk7XHJcbiAgICAgIHRoaXMuX2FwcGx5UG9zaXRpb24oYilcclxuICAgIH0sXHJcbiAgICBfY29uc3RyYWludFBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHRoaXMuX2dldFZhbHVlRm9yUG9zaXRpb24oYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLl9nZXRQb3NpdGlvbkZvclZhbHVlKGIpXHJcbiAgICB9LFxyXG4gICAgX2FwcGx5UG9zaXRpb246IGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgIGEudWkucmFuZ2VTbGlkZXJEcmFnZ2FibGUucHJvdG90eXBlLl9hcHBseVBvc2l0aW9uLmFwcGx5KHRoaXMsIFtiXSksIHRoaXMuX2xlZnQgPSBiLCB0aGlzLl9zZXRWYWx1ZSh0aGlzLl9nZXRWYWx1ZUZvclBvc2l0aW9uKGIpKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJtb3ZpbmdcIilcclxuICAgIH0sXHJcbiAgICBfcHJlcGFyZUV2ZW50RGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYiA9IGEudWkucmFuZ2VTbGlkZXJEcmFnZ2FibGUucHJvdG90eXBlLl9wcmVwYXJlRXZlbnREYXRhLmFwcGx5KHRoaXMpO1xyXG4gICAgICByZXR1cm4gYi52YWx1ZSA9IHRoaXMuX3ZhbHVlLCBiXHJcbiAgICB9LFxyXG4gICAgX3NldFZhbHVlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBhICE9PSB0aGlzLl92YWx1ZSAmJiAodGhpcy5fdmFsdWUgPSBhKVxyXG4gICAgfSxcclxuICAgIF9jb25zdHJhaW50VmFsdWU6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIGlmIChhID0gTWF0aC5taW4oYSwgdGhpcy5fYm91bmRzKCkubWF4KSwgYSA9IE1hdGgubWF4KGEsIHRoaXMuX2JvdW5kcygpLm1pbiksIGEgPSB0aGlzLl9yb3VuZChhKSwgdGhpcy5vcHRpb25zLnJhbmdlICE9PSAhMSkge1xyXG4gICAgICAgIHZhciBiID0gdGhpcy5vcHRpb25zLnJhbmdlLm1pbiB8fCAhMSwgYyA9IHRoaXMub3B0aW9ucy5yYW5nZS5tYXggfHwgITE7XHJcbiAgICAgICAgYiAhPT0gITEgJiYgKGEgPSBNYXRoLm1heChhLCB0aGlzLl9yb3VuZChiKSkpLCBjICE9PSAhMSAmJiAoYSA9IE1hdGgubWluKGEsIHRoaXMuX3JvdW5kKGMpKSksIGEgPSBNYXRoLm1pbihhLCB0aGlzLl9ib3VuZHMoKS5tYXgpLCBhID0gTWF0aC5tYXgoYSwgdGhpcy5fYm91bmRzKCkubWluKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhXHJcbiAgICB9LFxyXG4gICAgX3JvdW5kOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0ZXAgIT09ICExICYmIHRoaXMub3B0aW9ucy5zdGVwID4gMCA/IE1hdGgucm91bmQoYSAvIHRoaXMub3B0aW9ucy5zdGVwKSAqIHRoaXMub3B0aW9ucy5zdGVwIDogYVxyXG4gICAgfSxcclxuICAgIF9nZXRQb3NpdGlvbkZvclZhbHVlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBpZiAoIXRoaXMuY2FjaGUgfHwgIXRoaXMuY2FjaGUucGFyZW50IHx8IG51bGwgPT09IHRoaXMuY2FjaGUucGFyZW50Lm9mZnNldClyZXR1cm4gMDtcclxuICAgICAgYSA9IHRoaXMuX2NvbnN0cmFpbnRWYWx1ZShhKTtcclxuICAgICAgdmFyIGIgPSAoYSAtIHRoaXMub3B0aW9ucy5ib3VuZHMubWluKSAvICh0aGlzLm9wdGlvbnMuYm91bmRzLm1heCAtIHRoaXMub3B0aW9ucy5ib3VuZHMubWluKSxcclxuICAgICAgICBjID0gdGhpcy5jYWNoZS5wYXJlbnQud2lkdGgsIGQgPSB0aGlzLmNhY2hlLnBhcmVudC5vZmZzZXQubGVmdCxcclxuICAgICAgICBlID0gdGhpcy5vcHRpb25zLmlzTGVmdCA/IDAgOiB0aGlzLmNhY2hlLndpZHRoLm91dGVyO1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN5bW1ldHJpY1Bvc2l0aW9ubmluZyA/IGIgKiAoYyAtIDIgKiB0aGlzLmNhY2hlLndpZHRoLm91dGVyKSArIGQgKyBlIDogYiAqIGMgKyBkIC0gZVxyXG4gICAgfSxcclxuICAgIF9nZXRWYWx1ZUZvclBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHRoaXMuX2dldFJhd1ZhbHVlRm9yUG9zaXRpb25BbmRCb3VuZHMoYSwgdGhpcy5vcHRpb25zLmJvdW5kcy5taW4sIHRoaXMub3B0aW9ucy5ib3VuZHMubWF4KTtcclxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnRWYWx1ZShiKVxyXG4gICAgfSxcclxuICAgIF9nZXRSYXdWYWx1ZUZvclBvc2l0aW9uQW5kQm91bmRzOiBmdW5jdGlvbiAoYSwgYiwgYykge1xyXG4gICAgICB2YXIgZCwgZSwgZiA9IG51bGwgPT09IHRoaXMuY2FjaGUucGFyZW50Lm9mZnNldCA/IDAgOiB0aGlzLmNhY2hlLnBhcmVudC5vZmZzZXQubGVmdDtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5zeW1tZXRyaWNQb3NpdGlvbm5pbmcgPyAoYSAtPSB0aGlzLm9wdGlvbnMuaXNMZWZ0ID8gMCA6IHRoaXMuY2FjaGUud2lkdGgub3V0ZXIsIGQgPSB0aGlzLmNhY2hlLnBhcmVudC53aWR0aCAtIDIgKiB0aGlzLmNhY2hlLndpZHRoLm91dGVyKSA6IChhICs9IHRoaXMub3B0aW9ucy5pc0xlZnQgPyAwIDogdGhpcy5jYWNoZS53aWR0aC5vdXRlciwgZCA9IHRoaXMuY2FjaGUucGFyZW50LndpZHRoKSwgMCA9PT0gZCA/IHRoaXMuX3ZhbHVlIDogKGUgPSAoYSAtIGYpIC8gZCwgZSAqIChjIC0gYikgKyBiKVxyXG4gICAgfSxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYSAmJiAodGhpcy5fY2FjaGUoKSwgYSA9IHRoaXMuX2NvbnN0cmFpbnRWYWx1ZShhKSwgdGhpcy5fcG9zaXRpb24oYSkpLCB0aGlzLl92YWx1ZVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9jYWNoZSgpO1xyXG4gICAgICB2YXIgYSA9IHRoaXMuX2NvbnN0cmFpbnRWYWx1ZSh0aGlzLl92YWx1ZSksIGIgPSB0aGlzLl9nZXRQb3NpdGlvbkZvclZhbHVlKGEpO1xyXG4gICAgICBhICE9PSB0aGlzLl92YWx1ZSA/ICh0aGlzLl90cmlnZ2VyTW91c2VFdmVudChcInVwZGF0aW5nXCIpLCB0aGlzLl9wb3NpdGlvbihhKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJ1cGRhdGVcIikpIDogYiAhPT0gdGhpcy5jYWNoZS5vZmZzZXQubGVmdCAmJiAodGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJ1cGRhdGluZ1wiKSwgdGhpcy5fcG9zaXRpb24oYSksIHRoaXMuX3RyaWdnZXJNb3VzZUV2ZW50KFwidXBkYXRlXCIpKVxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYSAmJiAodGhpcy5fY2FjaGUoKSwgYSA9IHRoaXMuX2NvbnN0cmFpbnRQb3NpdGlvbihhKSwgdGhpcy5fYXBwbHlQb3NpdGlvbihhKSksIHRoaXMuX2xlZnRcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBhICsgYlxyXG4gICAgfSxcclxuICAgIHN1YnN0cmFjdDogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIGEgLSBiXHJcbiAgICB9LFxyXG4gICAgc3RlcHNCZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnN0ZXAgPT09ICExID8gYiAtIGEgOiAoYiAtIGEpIC8gdGhpcy5vcHRpb25zLnN0ZXBcclxuICAgIH0sXHJcbiAgICBtdWx0aXBseVN0ZXA6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBhICogYlxyXG4gICAgfSxcclxuICAgIG1vdmVSaWdodDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGI7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc3RlcCA9PT0gITEgPyAoYiA9IHRoaXMuX2xlZnQsIHRoaXMucG9zaXRpb24odGhpcy5fbGVmdCArIGEpLCB0aGlzLl9sZWZ0IC0gYikgOiAoYiA9IHRoaXMuX3ZhbHVlLCB0aGlzLnZhbHVlKHRoaXMuYWRkKGIsIHRoaXMubXVsdGlwbHlTdGVwKHRoaXMub3B0aW9ucy5zdGVwLCBhKSkpLCB0aGlzLnN0ZXBzQmV0d2VlbihiLCB0aGlzLl92YWx1ZSkpXHJcbiAgICB9LFxyXG4gICAgbW92ZUxlZnQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiAtdGhpcy5tb3ZlUmlnaHQoLWEpXHJcbiAgICB9LFxyXG4gICAgc3RlcFJhdGlvOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RlcCA9PT0gITEpcmV0dXJuIDE7XHJcbiAgICAgIHZhciBhID0gKHRoaXMub3B0aW9ucy5ib3VuZHMubWF4IC0gdGhpcy5vcHRpb25zLmJvdW5kcy5taW4pIC8gdGhpcy5vcHRpb25zLnN0ZXA7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLnBhcmVudC53aWR0aCAvIGFcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgZnVuY3Rpb24gYyhhLCBiKSB7XHJcbiAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiA9PSB0eXBlb2YgYSA/IGIgfHwgITEgOiBhXHJcbiAgfVxyXG5cclxuICBhLndpZGdldChcInVpLnJhbmdlU2xpZGVyQmFyXCIsIGEudWkucmFuZ2VTbGlkZXJEcmFnZ2FibGUsIHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgbGVmdEhhbmRsZTogbnVsbCxcclxuICAgICAgcmlnaHRIYW5kbGU6IG51bGwsXHJcbiAgICAgIGJvdW5kczoge21pbjogMCwgbWF4OiAxMDB9LFxyXG4gICAgICB0eXBlOiBcInJhbmdlU2xpZGVySGFuZGxlXCIsXHJcbiAgICAgIHJhbmdlOiAhMSxcclxuICAgICAgZHJhZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB9LFxyXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIH0sXHJcbiAgICAgIHZhbHVlczoge21pbjogMCwgbWF4OiAyMH0sXHJcbiAgICAgIHdoZWVsU3BlZWQ6IDQsXHJcbiAgICAgIHdoZWVsTW9kZTogbnVsbFxyXG4gICAgfSwgX3ZhbHVlczoge21pbjogMCwgbWF4OiAyMH0sIF93YWl0aW5nVG9Jbml0OiAyLCBfd2hlZWxUaW1lb3V0OiAhMSwgX2NyZWF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5fY3JlYXRlLmFwcGx5KHRoaXMpLCB0aGlzLmVsZW1lbnQuY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKS5jc3MoXCJ0b3BcIiwgMCkuYWRkQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1iYXJcIiksIHRoaXMub3B0aW9ucy5sZWZ0SGFuZGxlLmJpbmQoXCJpbml0aWFsaXplXCIsIGEucHJveHkodGhpcy5fb25Jbml0aWFsaXplZCwgdGhpcykpLmJpbmQoXCJtb3VzZXN0YXJ0XCIsIGEucHJveHkodGhpcy5fY2FjaGUsIHRoaXMpKS5iaW5kKFwic3RvcFwiLCBhLnByb3h5KHRoaXMuX29uSGFuZGxlU3RvcCwgdGhpcykpLCB0aGlzLm9wdGlvbnMucmlnaHRIYW5kbGUuYmluZChcImluaXRpYWxpemVcIiwgYS5wcm94eSh0aGlzLl9vbkluaXRpYWxpemVkLCB0aGlzKSkuYmluZChcIm1vdXNlc3RhcnRcIiwgYS5wcm94eSh0aGlzLl9jYWNoZSwgdGhpcykpLmJpbmQoXCJzdG9wXCIsIGEucHJveHkodGhpcy5fb25IYW5kbGVTdG9wLCB0aGlzKSksIHRoaXMuX2JpbmRIYW5kbGVzKCksIHRoaXMuX3ZhbHVlcyA9IHRoaXMub3B0aW9ucy52YWx1ZXMsIHRoaXMuX3NldFdoZWVsTW9kZU9wdGlvbih0aGlzLm9wdGlvbnMud2hlZWxNb2RlKVxyXG4gICAgfSwgZGVzdHJveTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMubGVmdEhhbmRsZS51bmJpbmQoXCIuYmFyXCIpLCB0aGlzLm9wdGlvbnMucmlnaHRIYW5kbGUudW5iaW5kKFwiLmJhclwiKSwgdGhpcy5vcHRpb25zID0gbnVsbCwgYS51aS5yYW5nZVNsaWRlckRyYWdnYWJsZS5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKVxyXG4gICAgfSwgX3NldE9wdGlvbjogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgXCJyYW5nZVwiID09PSBhID8gdGhpcy5fc2V0UmFuZ2VPcHRpb24oYikgOiBcIndoZWVsU3BlZWRcIiA9PT0gYSA/IHRoaXMuX3NldFdoZWVsU3BlZWRPcHRpb24oYikgOiBcIndoZWVsTW9kZVwiID09PSBhICYmIHRoaXMuX3NldFdoZWVsTW9kZU9wdGlvbihiKVxyXG4gICAgfSwgX3NldFJhbmdlT3B0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBpZiAoKFwib2JqZWN0XCIgIT0gdHlwZW9mIGEgfHwgbnVsbCA9PT0gYSkgJiYgKGEgPSAhMSksIGEgIT09ICExIHx8IHRoaXMub3B0aW9ucy5yYW5nZSAhPT0gITEpIHtcclxuICAgICAgICBpZiAoYSAhPT0gITEpIHtcclxuICAgICAgICAgIHZhciBiID0gYyhhLm1pbiwgdGhpcy5vcHRpb25zLnJhbmdlLm1pbiksIGQgPSBjKGEubWF4LCB0aGlzLm9wdGlvbnMucmFuZ2UubWF4KTtcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy5yYW5nZSA9IHttaW46IGIsIG1heDogZH1cclxuICAgICAgICB9IGVsc2UgdGhpcy5vcHRpb25zLnJhbmdlID0gITE7XHJcbiAgICAgICAgdGhpcy5fc2V0TGVmdFJhbmdlKCksIHRoaXMuX3NldFJpZ2h0UmFuZ2UoKVxyXG4gICAgICB9XHJcbiAgICB9LCBfc2V0V2hlZWxTcGVlZE9wdGlvbjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgXCJudW1iZXJcIiA9PSB0eXBlb2YgYSAmJiAwICE9PSBhICYmICh0aGlzLm9wdGlvbnMud2hlZWxTcGVlZCA9IGEpXHJcbiAgICB9LCBfc2V0V2hlZWxNb2RlT3B0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAobnVsbCA9PT0gYSB8fCBhID09PSAhMSB8fCBcInpvb21cIiA9PT0gYSB8fCBcInNjcm9sbFwiID09PSBhKSAmJiAodGhpcy5vcHRpb25zLndoZWVsTW9kZSAhPT0gYSAmJiB0aGlzLmVsZW1lbnQucGFyZW50KCkudW5iaW5kKFwibW91c2V3aGVlbC5iYXJcIiksIHRoaXMuX2JpbmRNb3VzZVdoZWVsKGEpLCB0aGlzLm9wdGlvbnMud2hlZWxNb2RlID0gYSlcclxuICAgIH0sIF9iaW5kTW91c2VXaGVlbDogZnVuY3Rpb24gKGIpIHtcclxuICAgICAgXCJ6b29tXCIgPT09IGIgPyB0aGlzLmVsZW1lbnQucGFyZW50KCkuYmluZChcIm1vdXNld2hlZWwuYmFyXCIsIGEucHJveHkodGhpcy5fbW91c2VXaGVlbFpvb20sIHRoaXMpKSA6IFwic2Nyb2xsXCIgPT09IGIgJiYgdGhpcy5lbGVtZW50LnBhcmVudCgpLmJpbmQoXCJtb3VzZXdoZWVsLmJhclwiLCBhLnByb3h5KHRoaXMuX21vdXNlV2hlZWxTY3JvbGwsIHRoaXMpKVxyXG4gICAgfSwgX3NldExlZnRSYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlID09PSAhMSlyZXR1cm4gITE7XHJcbiAgICAgIHZhciBhID0gdGhpcy5fdmFsdWVzLm1heCwgYiA9IHttaW46ICExLCBtYXg6ICExfTtcclxuICAgICAgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgdGhpcy5vcHRpb25zLnJhbmdlLm1pbiAmJiB0aGlzLm9wdGlvbnMucmFuZ2UubWluICE9PSAhMSA/IGIubWF4ID0gdGhpcy5fbGVmdEhhbmRsZShcInN1YnN0cmFjdFwiLCBhLCB0aGlzLm9wdGlvbnMucmFuZ2UubWluKSA6IGIubWF4ID0gITEsIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIHRoaXMub3B0aW9ucy5yYW5nZS5tYXggJiYgdGhpcy5vcHRpb25zLnJhbmdlLm1heCAhPT0gITEgPyBiLm1pbiA9IHRoaXMuX2xlZnRIYW5kbGUoXCJzdWJzdHJhY3RcIiwgYSwgdGhpcy5vcHRpb25zLnJhbmdlLm1heCkgOiBiLm1pbiA9ICExLCB0aGlzLl9sZWZ0SGFuZGxlKFwib3B0aW9uXCIsIFwicmFuZ2VcIiwgYilcclxuICAgIH0sIF9zZXRSaWdodFJhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBhID0gdGhpcy5fdmFsdWVzLm1pbiwgYiA9IHttaW46ICExLCBtYXg6ICExfTtcclxuICAgICAgXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgdGhpcy5vcHRpb25zLnJhbmdlLm1pbiAmJiB0aGlzLm9wdGlvbnMucmFuZ2UubWluICE9PSAhMSA/IGIubWluID0gdGhpcy5fcmlnaHRIYW5kbGUoXCJhZGRcIiwgYSwgdGhpcy5vcHRpb25zLnJhbmdlLm1pbikgOiBiLm1pbiA9ICExLCBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiB0aGlzLm9wdGlvbnMucmFuZ2UubWF4ICYmIHRoaXMub3B0aW9ucy5yYW5nZS5tYXggIT09ICExID8gYi5tYXggPSB0aGlzLl9yaWdodEhhbmRsZShcImFkZFwiLCBhLCB0aGlzLm9wdGlvbnMucmFuZ2UubWF4KSA6IGIubWF4ID0gITEsIHRoaXMuX3JpZ2h0SGFuZGxlKFwib3B0aW9uXCIsIFwicmFuZ2VcIiwgYilcclxuICAgIH0sIF9kZWFjdGl2YXRlUmFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fbGVmdEhhbmRsZShcIm9wdGlvblwiLCBcInJhbmdlXCIsICExKSwgdGhpcy5fcmlnaHRIYW5kbGUoXCJvcHRpb25cIiwgXCJyYW5nZVwiLCAhMSlcclxuICAgIH0sIF9yZWFjdGl2YXRlUmFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fc2V0UmFuZ2VPcHRpb24odGhpcy5vcHRpb25zLnJhbmdlKVxyXG4gICAgfSwgX29uSW5pdGlhbGl6ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fd2FpdGluZ1RvSW5pdC0tLCAwID09PSB0aGlzLl93YWl0aW5nVG9Jbml0ICYmIHRoaXMuX2luaXRNZSgpXHJcbiAgICB9LCBfaW5pdE1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2NhY2hlKCksIHRoaXMubWluKHRoaXMuX3ZhbHVlcy5taW4pLCB0aGlzLm1heCh0aGlzLl92YWx1ZXMubWF4KTtcclxuICAgICAgdmFyIGEgPSB0aGlzLl9sZWZ0SGFuZGxlKFwicG9zaXRpb25cIiksIGIgPSB0aGlzLl9yaWdodEhhbmRsZShcInBvc2l0aW9uXCIpICsgdGhpcy5vcHRpb25zLnJpZ2h0SGFuZGxlLndpZHRoKCk7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5vZmZzZXQoe2xlZnQ6IGF9KSwgdGhpcy5lbGVtZW50LmNzcyhcIndpZHRoXCIsIGIgLSBhKVxyXG4gICAgfSwgX2xlZnRIYW5kbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZVByb3h5KHRoaXMub3B0aW9ucy5sZWZ0SGFuZGxlLCBhcmd1bWVudHMpXHJcbiAgICB9LCBfcmlnaHRIYW5kbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2hhbmRsZVByb3h5KHRoaXMub3B0aW9ucy5yaWdodEhhbmRsZSwgYXJndW1lbnRzKVxyXG4gICAgfSwgX2hhbmRsZVByb3h5OiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB2YXIgYyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGIpO1xyXG4gICAgICByZXR1cm4gYVt0aGlzLm9wdGlvbnMudHlwZV0uYXBwbHkoYSwgYylcclxuICAgIH0sIF9jYWNoZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5fY2FjaGUuYXBwbHkodGhpcyksIHRoaXMuX2NhY2hlSGFuZGxlcygpXHJcbiAgICB9LCBfY2FjaGVIYW5kbGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuY2FjaGUucmlnaHRIYW5kbGUgPSB7fSwgdGhpcy5jYWNoZS5yaWdodEhhbmRsZS53aWR0aCA9IHRoaXMub3B0aW9ucy5yaWdodEhhbmRsZS53aWR0aCgpLCB0aGlzLmNhY2hlLnJpZ2h0SGFuZGxlLm9mZnNldCA9IHRoaXMub3B0aW9ucy5yaWdodEhhbmRsZS5vZmZzZXQoKSwgdGhpcy5jYWNoZS5sZWZ0SGFuZGxlID0ge30sIHRoaXMuY2FjaGUubGVmdEhhbmRsZS5vZmZzZXQgPSB0aGlzLm9wdGlvbnMubGVmdEhhbmRsZS5vZmZzZXQoKVxyXG4gICAgfSwgX21vdXNlU3RhcnQ6IGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgIGEudWkucmFuZ2VTbGlkZXJEcmFnZ2FibGUucHJvdG90eXBlLl9tb3VzZVN0YXJ0LmFwcGx5KHRoaXMsIFtiXSksIHRoaXMuX2RlYWN0aXZhdGVSYW5nZSgpXHJcbiAgICB9LCBfbW91c2VTdG9wOiBmdW5jdGlvbiAoYikge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5fbW91c2VTdG9wLmFwcGx5KHRoaXMsIFtiXSksIHRoaXMuX2NhY2hlSGFuZGxlcygpLCB0aGlzLl92YWx1ZXMubWluID0gdGhpcy5fbGVmdEhhbmRsZShcInZhbHVlXCIpLCB0aGlzLl92YWx1ZXMubWF4ID0gdGhpcy5fcmlnaHRIYW5kbGUoXCJ2YWx1ZVwiKSwgdGhpcy5fcmVhY3RpdmF0ZVJhbmdlKCksIHRoaXMuX2xlZnRIYW5kbGUoKS50cmlnZ2VyKFwic3RvcFwiKSwgdGhpcy5fcmlnaHRIYW5kbGUoKS50cmlnZ2VyKFwic3RvcFwiKVxyXG4gICAgfSwgX29uRHJhZ0xlZnRIYW5kbGU6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIGlmICh0aGlzLl9jYWNoZUlmTmVjZXNzYXJ5KCksIGIuZWxlbWVudFswXSA9PT0gdGhpcy5vcHRpb25zLmxlZnRIYW5kbGVbMF0pIHtcclxuICAgICAgICBpZiAodGhpcy5fc3dpdGNoZWRWYWx1ZXMoKSlyZXR1cm4gdGhpcy5fc3dpdGNoSGFuZGxlcygpLCB2b2lkIHRoaXMuX29uRHJhZ1JpZ2h0SGFuZGxlKGEsIGIpO1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlcy5taW4gPSBiLnZhbHVlLCB0aGlzLmNhY2hlLm9mZnNldC5sZWZ0ID0gYi5vZmZzZXQubGVmdCwgdGhpcy5jYWNoZS5sZWZ0SGFuZGxlLm9mZnNldCA9IGIub2Zmc2V0LCB0aGlzLl9wb3NpdGlvbkJhcigpXHJcbiAgICAgIH1cclxuICAgIH0sIF9vbkRyYWdSaWdodEhhbmRsZTogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgaWYgKHRoaXMuX2NhY2hlSWZOZWNlc3NhcnkoKSwgYi5lbGVtZW50WzBdID09PSB0aGlzLm9wdGlvbnMucmlnaHRIYW5kbGVbMF0pIHtcclxuICAgICAgICBpZiAodGhpcy5fc3dpdGNoZWRWYWx1ZXMoKSlyZXR1cm4gdGhpcy5fc3dpdGNoSGFuZGxlcygpLCB2b2lkIHRoaXMuX29uRHJhZ0xlZnRIYW5kbGUoYSwgYik7XHJcbiAgICAgICAgdGhpcy5fdmFsdWVzLm1heCA9IGIudmFsdWUsIHRoaXMuY2FjaGUucmlnaHRIYW5kbGUub2Zmc2V0ID0gYi5vZmZzZXQsIHRoaXMuX3Bvc2l0aW9uQmFyKClcclxuICAgICAgfVxyXG4gICAgfSwgX3Bvc2l0aW9uQmFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBhID0gdGhpcy5jYWNoZS5yaWdodEhhbmRsZS5vZmZzZXQubGVmdCArIHRoaXMuY2FjaGUucmlnaHRIYW5kbGUud2lkdGggLSB0aGlzLmNhY2hlLmxlZnRIYW5kbGUub2Zmc2V0LmxlZnQ7XHJcbiAgICAgIHRoaXMuY2FjaGUud2lkdGguaW5uZXIgPSBhLCB0aGlzLmVsZW1lbnQuY3NzKFwid2lkdGhcIiwgYSkub2Zmc2V0KHtsZWZ0OiB0aGlzLmNhY2hlLmxlZnRIYW5kbGUub2Zmc2V0LmxlZnR9KVxyXG4gICAgfSwgX29uSGFuZGxlU3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9zZXRMZWZ0UmFuZ2UoKSwgdGhpcy5fc2V0UmlnaHRSYW5nZSgpXHJcbiAgICB9LCBfc3dpdGNoZWRWYWx1ZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMubWluKCkgPiB0aGlzLm1heCgpKSB7XHJcbiAgICAgICAgdmFyIGEgPSB0aGlzLl92YWx1ZXMubWluO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXMubWluID0gdGhpcy5fdmFsdWVzLm1heCwgdGhpcy5fdmFsdWVzLm1heCA9IGEsICEwXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuICExXHJcbiAgICB9LCBfc3dpdGNoSGFuZGxlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYSA9IHRoaXMub3B0aW9ucy5sZWZ0SGFuZGxlO1xyXG4gICAgICB0aGlzLm9wdGlvbnMubGVmdEhhbmRsZSA9IHRoaXMub3B0aW9ucy5yaWdodEhhbmRsZSwgdGhpcy5vcHRpb25zLnJpZ2h0SGFuZGxlID0gYSwgdGhpcy5fbGVmdEhhbmRsZShcIm9wdGlvblwiLCBcImlzTGVmdFwiLCAhMCksIHRoaXMuX3JpZ2h0SGFuZGxlKFwib3B0aW9uXCIsIFwiaXNMZWZ0XCIsICExKSwgdGhpcy5fYmluZEhhbmRsZXMoKSwgdGhpcy5fY2FjaGVIYW5kbGVzKClcclxuICAgIH0sIF9iaW5kSGFuZGxlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMubGVmdEhhbmRsZS51bmJpbmQoXCIuYmFyXCIpLmJpbmQoXCJzbGlkZXJEcmFnLmJhciB1cGRhdGUuYmFyIG1vdmluZy5iYXJcIiwgYS5wcm94eSh0aGlzLl9vbkRyYWdMZWZ0SGFuZGxlLCB0aGlzKSksIHRoaXMub3B0aW9ucy5yaWdodEhhbmRsZS51bmJpbmQoXCIuYmFyXCIpLmJpbmQoXCJzbGlkZXJEcmFnLmJhciB1cGRhdGUuYmFyIG1vdmluZy5iYXJcIiwgYS5wcm94eSh0aGlzLl9vbkRyYWdSaWdodEhhbmRsZSwgdGhpcykpXHJcbiAgICB9LCBfY29uc3RyYWludFBvc2l0aW9uOiBmdW5jdGlvbiAoYikge1xyXG4gICAgICB2YXIgYywgZCA9IHt9O1xyXG4gICAgICByZXR1cm4gZC5sZWZ0ID0gYS51aS5yYW5nZVNsaWRlckRyYWdnYWJsZS5wcm90b3R5cGUuX2NvbnN0cmFpbnRQb3NpdGlvbi5hcHBseSh0aGlzLCBbYl0pLCBkLmxlZnQgPSB0aGlzLl9sZWZ0SGFuZGxlKFwicG9zaXRpb25cIiwgZC5sZWZ0KSwgYyA9IHRoaXMuX3JpZ2h0SGFuZGxlKFwicG9zaXRpb25cIiwgZC5sZWZ0ICsgdGhpcy5jYWNoZS53aWR0aC5vdXRlciAtIHRoaXMuY2FjaGUucmlnaHRIYW5kbGUud2lkdGgpLCBkLndpZHRoID0gYyAtIGQubGVmdCArIHRoaXMuY2FjaGUucmlnaHRIYW5kbGUud2lkdGgsIGRcclxuICAgIH0sIF9hcHBseVBvc2l0aW9uOiBmdW5jdGlvbiAoYikge1xyXG4gICAgICBhLnVpLnJhbmdlU2xpZGVyRHJhZ2dhYmxlLnByb3RvdHlwZS5fYXBwbHlQb3NpdGlvbi5hcHBseSh0aGlzLCBbYi5sZWZ0XSksIHRoaXMuZWxlbWVudC53aWR0aChiLndpZHRoKVxyXG4gICAgfSwgX21vdXNlV2hlZWxab29tOiBmdW5jdGlvbiAoYiwgYywgZCwgZSkge1xyXG4gICAgICBpZiAoIXRoaXMuZW5hYmxlZClyZXR1cm4gITE7XHJcbiAgICAgIHZhciBmID0gdGhpcy5fdmFsdWVzLm1pbiArICh0aGlzLl92YWx1ZXMubWF4IC0gdGhpcy5fdmFsdWVzLm1pbikgLyAyLCBnID0ge30sIGggPSB7fTtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5yYW5nZSA9PT0gITEgfHwgdGhpcy5vcHRpb25zLnJhbmdlLm1pbiA9PT0gITEgPyAoZy5tYXggPSBmLCBoLm1pbiA9IGYpIDogKGcubWF4ID0gZiAtIHRoaXMub3B0aW9ucy5yYW5nZS5taW4gLyAyLCBoLm1pbiA9IGYgKyB0aGlzLm9wdGlvbnMucmFuZ2UubWluIC8gMiksIHRoaXMub3B0aW9ucy5yYW5nZSAhPT0gITEgJiYgdGhpcy5vcHRpb25zLnJhbmdlLm1heCAhPT0gITEgJiYgKGcubWluID0gZiAtIHRoaXMub3B0aW9ucy5yYW5nZS5tYXggLyAyLCBoLm1heCA9IGYgKyB0aGlzLm9wdGlvbnMucmFuZ2UubWF4IC8gMiksIHRoaXMuX2xlZnRIYW5kbGUoXCJvcHRpb25cIiwgXCJyYW5nZVwiLCBnKSwgdGhpcy5fcmlnaHRIYW5kbGUoXCJvcHRpb25cIiwgXCJyYW5nZVwiLCBoKSwgY2xlYXJUaW1lb3V0KHRoaXMuX3doZWVsVGltZW91dCksIHRoaXMuX3doZWVsVGltZW91dCA9IHNldFRpbWVvdXQoYS5wcm94eSh0aGlzLl93aGVlbFN0b3AsIHRoaXMpLCAyMDApLCB0aGlzLnpvb21JbihlICogdGhpcy5vcHRpb25zLndoZWVsU3BlZWQpLCAhMVxyXG4gICAgfSwgX21vdXNlV2hlZWxTY3JvbGw6IGZ1bmN0aW9uIChiLCBjLCBkLCBlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmVuYWJsZWQgPyAodGhpcy5fd2hlZWxUaW1lb3V0ID09PSAhMSA/IHRoaXMuc3RhcnRTY3JvbGwoKSA6IGNsZWFyVGltZW91dCh0aGlzLl93aGVlbFRpbWVvdXQpLCB0aGlzLl93aGVlbFRpbWVvdXQgPSBzZXRUaW1lb3V0KGEucHJveHkodGhpcy5fd2hlZWxTdG9wLCB0aGlzKSwgMjAwKSwgdGhpcy5zY3JvbGxMZWZ0KGUgKiB0aGlzLm9wdGlvbnMud2hlZWxTcGVlZCksICExKSA6ICExXHJcbiAgICB9LCBfd2hlZWxTdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuc3RvcFNjcm9sbCgpLCB0aGlzLl93aGVlbFRpbWVvdXQgPSAhMVxyXG4gICAgfSwgbWluOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fbGVmdEhhbmRsZShcInZhbHVlXCIsIGEpXHJcbiAgICB9LCBtYXg6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yaWdodEhhbmRsZShcInZhbHVlXCIsIGEpXHJcbiAgICB9LCBzdGFydFNjcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9kZWFjdGl2YXRlUmFuZ2UoKVxyXG4gICAgfSwgc3RvcFNjcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9yZWFjdGl2YXRlUmFuZ2UoKSwgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJzdG9wXCIpLCB0aGlzLl9sZWZ0SGFuZGxlKCkudHJpZ2dlcihcInN0b3BcIiksIHRoaXMuX3JpZ2h0SGFuZGxlKCkudHJpZ2dlcihcInN0b3BcIilcclxuICAgIH0sIHNjcm9sbExlZnQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiBhID0gYSB8fCAxLCAwID4gYSA/IHRoaXMuc2Nyb2xsUmlnaHQoLWEpIDogKGEgPSB0aGlzLl9sZWZ0SGFuZGxlKFwibW92ZUxlZnRcIiwgYSksIHRoaXMuX3JpZ2h0SGFuZGxlKFwibW92ZUxlZnRcIiwgYSksIHRoaXMudXBkYXRlKCksIHZvaWQgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJzY3JvbGxcIikpXHJcbiAgICB9LCBzY3JvbGxSaWdodDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIGEgPSBhIHx8IDEsIDAgPiBhID8gdGhpcy5zY3JvbGxMZWZ0KC1hKSA6IChhID0gdGhpcy5fcmlnaHRIYW5kbGUoXCJtb3ZlUmlnaHRcIiwgYSksIHRoaXMuX2xlZnRIYW5kbGUoXCJtb3ZlUmlnaHRcIiwgYSksIHRoaXMudXBkYXRlKCksIHZvaWQgdGhpcy5fdHJpZ2dlck1vdXNlRXZlbnQoXCJzY3JvbGxcIikpXHJcbiAgICB9LCB6b29tSW46IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIGlmIChhID0gYSB8fCAxLCAwID4gYSlyZXR1cm4gdGhpcy56b29tT3V0KC1hKTtcclxuICAgICAgdmFyIGIgPSB0aGlzLl9yaWdodEhhbmRsZShcIm1vdmVMZWZ0XCIsIGEpO1xyXG4gICAgICBhID4gYiAmJiAoYiAvPSAyLCB0aGlzLl9yaWdodEhhbmRsZShcIm1vdmVSaWdodFwiLCBiKSksIHRoaXMuX2xlZnRIYW5kbGUoXCJtb3ZlUmlnaHRcIiwgYiksIHRoaXMudXBkYXRlKCksIHRoaXMuX3RyaWdnZXJNb3VzZUV2ZW50KFwiem9vbVwiKVxyXG4gICAgfSwgem9vbU91dDogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgaWYgKGEgPSBhIHx8IDEsIDAgPiBhKXJldHVybiB0aGlzLnpvb21JbigtYSk7XHJcbiAgICAgIHZhciBiID0gdGhpcy5fcmlnaHRIYW5kbGUoXCJtb3ZlUmlnaHRcIiwgYSk7XHJcbiAgICAgIGEgPiBiICYmIChiIC89IDIsIHRoaXMuX3JpZ2h0SGFuZGxlKFwibW92ZUxlZnRcIiwgYikpLCB0aGlzLl9sZWZ0SGFuZGxlKFwibW92ZUxlZnRcIiwgYiksIHRoaXMudXBkYXRlKCksIHRoaXMuX3RyaWdnZXJNb3VzZUV2ZW50KFwiem9vbVwiKVxyXG4gICAgfSwgdmFsdWVzOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYSAmJiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBiKSB7XHJcbiAgICAgICAgdmFyIGMgPSBNYXRoLm1pbihhLCBiKSwgZCA9IE1hdGgubWF4KGEsIGIpO1xyXG4gICAgICAgIHRoaXMuX2RlYWN0aXZhdGVSYW5nZSgpLCB0aGlzLm9wdGlvbnMubGVmdEhhbmRsZS51bmJpbmQoXCIuYmFyXCIpLCB0aGlzLm9wdGlvbnMucmlnaHRIYW5kbGUudW5iaW5kKFwiLmJhclwiKSwgdGhpcy5fdmFsdWVzLm1pbiA9IHRoaXMuX2xlZnRIYW5kbGUoXCJ2YWx1ZVwiLCBjKSwgdGhpcy5fdmFsdWVzLm1heCA9IHRoaXMuX3JpZ2h0SGFuZGxlKFwidmFsdWVcIiwgZCksIHRoaXMuX2JpbmRIYW5kbGVzKCksIHRoaXMuX3JlYWN0aXZhdGVSYW5nZSgpLCB0aGlzLnVwZGF0ZSgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHttaW46IHRoaXMuX3ZhbHVlcy5taW4sIG1heDogdGhpcy5fdmFsdWVzLm1heH1cclxuICAgIH0sIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl92YWx1ZXMubWluID0gdGhpcy5taW4oKSwgdGhpcy5fdmFsdWVzLm1heCA9IHRoaXMubWF4KCksIHRoaXMuX2NhY2hlKCksIHRoaXMuX3Bvc2l0aW9uQmFyKClcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgZnVuY3Rpb24gYyhiLCBjLCBkLCBlKSB7XHJcbiAgICB0aGlzLmxhYmVsMSA9IGIsIHRoaXMubGFiZWwyID0gYywgdGhpcy50eXBlID0gZCwgdGhpcy5vcHRpb25zID0gZSwgdGhpcy5oYW5kbGUxID0gdGhpcy5sYWJlbDFbdGhpcy50eXBlXShcIm9wdGlvblwiLCBcImhhbmRsZVwiKSwgdGhpcy5oYW5kbGUyID0gdGhpcy5sYWJlbDJbdGhpcy50eXBlXShcIm9wdGlvblwiLCBcImhhbmRsZVwiKSwgdGhpcy5jYWNoZSA9IG51bGwsIHRoaXMubGVmdCA9IGIsIHRoaXMucmlnaHQgPSBjLCB0aGlzLm1vdmluZyA9ICExLCB0aGlzLmluaXRpYWxpemVkID0gITEsIHRoaXMudXBkYXRpbmcgPSAhMSwgdGhpcy5Jbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLkJpbmRIYW5kbGUodGhpcy5oYW5kbGUxKSwgdGhpcy5CaW5kSGFuZGxlKHRoaXMuaGFuZGxlMiksIFwic2hvd1wiID09PSB0aGlzLm9wdGlvbnMuc2hvdyA/IChzZXRUaW1lb3V0KGEucHJveHkodGhpcy5Qb3NpdGlvbkxhYmVscywgdGhpcyksIDEpLCB0aGlzLmluaXRpYWxpemVkID0gITApIDogc2V0VGltZW91dChhLnByb3h5KHRoaXMuQWZ0ZXJJbml0LCB0aGlzKSwgMWUzKSwgdGhpcy5fcmVzaXplUHJveHkgPSBhLnByb3h5KHRoaXMub25XaW5kb3dSZXNpemUsIHRoaXMpLCBhKHdpbmRvdykucmVzaXplKHRoaXMuX3Jlc2l6ZVByb3h5KVxyXG4gICAgfSwgdGhpcy5EZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9yZXNpemVQcm94eSAmJiAoYSh3aW5kb3cpLnVuYmluZChcInJlc2l6ZVwiLCB0aGlzLl9yZXNpemVQcm94eSksIHRoaXMuX3Jlc2l6ZVByb3h5ID0gbnVsbCwgdGhpcy5oYW5kbGUxLnVuYmluZChcIi5wb3NpdGlvbm5lclwiKSwgdGhpcy5oYW5kbGUxID0gbnVsbCwgdGhpcy5oYW5kbGUyLnVuYmluZChcIi5wb3NpdGlvbm5lclwiKSwgdGhpcy5oYW5kbGUyID0gbnVsbCwgdGhpcy5sYWJlbDEgPSBudWxsLCB0aGlzLmxhYmVsMiA9IG51bGwsIHRoaXMubGVmdCA9IG51bGwsIHRoaXMucmlnaHQgPSBudWxsKSwgdGhpcy5jYWNoZSA9IG51bGxcclxuICAgIH0sIHRoaXMuQWZ0ZXJJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gITBcclxuICAgIH0sIHRoaXMuQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFwibm9uZVwiICE9PSB0aGlzLmxhYmVsMS5jc3MoXCJkaXNwbGF5XCIpICYmICh0aGlzLmNhY2hlID0ge30sIHRoaXMuY2FjaGUubGFiZWwxID0ge30sIHRoaXMuY2FjaGUubGFiZWwyID0ge30sIHRoaXMuY2FjaGUuaGFuZGxlMSA9IHt9LCB0aGlzLmNhY2hlLmhhbmRsZTIgPSB7fSwgdGhpcy5jYWNoZS5vZmZzZXRQYXJlbnQgPSB7fSwgdGhpcy5DYWNoZUVsZW1lbnQodGhpcy5sYWJlbDEsIHRoaXMuY2FjaGUubGFiZWwxKSwgdGhpcy5DYWNoZUVsZW1lbnQodGhpcy5sYWJlbDIsIHRoaXMuY2FjaGUubGFiZWwyKSwgdGhpcy5DYWNoZUVsZW1lbnQodGhpcy5oYW5kbGUxLCB0aGlzLmNhY2hlLmhhbmRsZTEpLCB0aGlzLkNhY2hlRWxlbWVudCh0aGlzLmhhbmRsZTIsIHRoaXMuY2FjaGUuaGFuZGxlMiksIHRoaXMuQ2FjaGVFbGVtZW50KHRoaXMubGFiZWwxLm9mZnNldFBhcmVudCgpLCB0aGlzLmNhY2hlLm9mZnNldFBhcmVudCkpXHJcbiAgICB9LCB0aGlzLkNhY2hlSWZOZWNlc3NhcnkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIG51bGwgPT09IHRoaXMuY2FjaGUgPyB0aGlzLkNhY2hlKCkgOiAodGhpcy5DYWNoZVdpZHRoKHRoaXMubGFiZWwxLCB0aGlzLmNhY2hlLmxhYmVsMSksIHRoaXMuQ2FjaGVXaWR0aCh0aGlzLmxhYmVsMiwgdGhpcy5jYWNoZS5sYWJlbDIpLCB0aGlzLkNhY2hlSGVpZ2h0KHRoaXMubGFiZWwxLCB0aGlzLmNhY2hlLmxhYmVsMSksIHRoaXMuQ2FjaGVIZWlnaHQodGhpcy5sYWJlbDIsIHRoaXMuY2FjaGUubGFiZWwyKSwgdGhpcy5DYWNoZVdpZHRoKHRoaXMubGFiZWwxLm9mZnNldFBhcmVudCgpLCB0aGlzLmNhY2hlLm9mZnNldFBhcmVudCkpXHJcbiAgICB9LCB0aGlzLkNhY2hlRWxlbWVudCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHRoaXMuQ2FjaGVXaWR0aChhLCBiKSwgdGhpcy5DYWNoZUhlaWdodChhLCBiKSwgYi5vZmZzZXQgPSBhLm9mZnNldCgpLCBiLm1hcmdpbiA9IHtcclxuICAgICAgICBsZWZ0OiB0aGlzLlBhcnNlUGl4ZWxzKFwibWFyZ2luTGVmdFwiLCBhKSxcclxuICAgICAgICByaWdodDogdGhpcy5QYXJzZVBpeGVscyhcIm1hcmdpblJpZ2h0XCIsIGEpXHJcbiAgICAgIH0sIGIuYm9yZGVyID0ge2xlZnQ6IHRoaXMuUGFyc2VQaXhlbHMoXCJib3JkZXJMZWZ0V2lkdGhcIiwgYSksIHJpZ2h0OiB0aGlzLlBhcnNlUGl4ZWxzKFwiYm9yZGVyUmlnaHRXaWR0aFwiLCBhKX1cclxuICAgIH0sIHRoaXMuQ2FjaGVXaWR0aCA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIGIud2lkdGggPSBhLndpZHRoKCksIGIub3V0ZXJXaWR0aCA9IGEub3V0ZXJXaWR0aCgpXHJcbiAgICB9LCB0aGlzLkNhY2hlSGVpZ2h0ID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgYi5vdXRlckhlaWdodE1hcmdpbiA9IGEub3V0ZXJIZWlnaHQoITApXHJcbiAgICB9LCB0aGlzLlBhcnNlUGl4ZWxzID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KGIuY3NzKGEpLCAxMCkgfHwgMFxyXG4gICAgfSwgdGhpcy5CaW5kSGFuZGxlID0gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgYi5iaW5kKFwidXBkYXRpbmcucG9zaXRpb25uZXJcIiwgYS5wcm94eSh0aGlzLm9uSGFuZGxlVXBkYXRpbmcsIHRoaXMpKSwgYi5iaW5kKFwidXBkYXRlLnBvc2l0aW9ubmVyXCIsIGEucHJveHkodGhpcy5vbkhhbmRsZVVwZGF0ZWQsIHRoaXMpKSwgYi5iaW5kKFwibW92aW5nLnBvc2l0aW9ubmVyXCIsIGEucHJveHkodGhpcy5vbkhhbmRsZU1vdmluZywgdGhpcykpLCBiLmJpbmQoXCJzdG9wLnBvc2l0aW9ubmVyXCIsIGEucHJveHkodGhpcy5vbkhhbmRsZVN0b3AsIHRoaXMpKVxyXG4gICAgfSwgdGhpcy5Qb3NpdGlvbkxhYmVscyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuQ2FjaGVJZk5lY2Vzc2FyeSgpLCBudWxsICE9PSB0aGlzLmNhY2hlKSB7XHJcbiAgICAgICAgdmFyIGEgPSB0aGlzLkdldFJhd1Bvc2l0aW9uKHRoaXMuY2FjaGUubGFiZWwxLCB0aGlzLmNhY2hlLmhhbmRsZTEpLFxyXG4gICAgICAgICAgYiA9IHRoaXMuR2V0UmF3UG9zaXRpb24odGhpcy5jYWNoZS5sYWJlbDIsIHRoaXMuY2FjaGUuaGFuZGxlMik7XHJcbiAgICAgICAgdGhpcy5sYWJlbDFbZF0oXCJvcHRpb25cIiwgXCJpc0xlZnRcIikgPyB0aGlzLkNvbnN0cmFpbnRQb3NpdGlvbnMoYSwgYikgOiB0aGlzLkNvbnN0cmFpbnRQb3NpdGlvbnMoYiwgYSksIHRoaXMuUG9zaXRpb25MYWJlbCh0aGlzLmxhYmVsMSwgYS5sZWZ0LCB0aGlzLmNhY2hlLmxhYmVsMSksIHRoaXMuUG9zaXRpb25MYWJlbCh0aGlzLmxhYmVsMiwgYi5sZWZ0LCB0aGlzLmNhY2hlLmxhYmVsMilcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcy5Qb3NpdGlvbkxhYmVsID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgdmFyIGQsIGUsIGYsIGcgPSB0aGlzLmNhY2hlLm9mZnNldFBhcmVudC5vZmZzZXQubGVmdCArIHRoaXMuY2FjaGUub2Zmc2V0UGFyZW50LmJvcmRlci5sZWZ0O1xyXG4gICAgICBnIC0gYiA+PSAwID8gKGEuY3NzKFwicmlnaHRcIiwgXCJcIiksIGEub2Zmc2V0KHtsZWZ0OiBifSkpIDogKGQgPSBnICsgdGhpcy5jYWNoZS5vZmZzZXRQYXJlbnQud2lkdGgsIGUgPSBiICsgYy5tYXJnaW4ubGVmdCArIGMub3V0ZXJXaWR0aCArIGMubWFyZ2luLnJpZ2h0LCBmID0gZCAtIGUsIGEuY3NzKFwibGVmdFwiLCBcIlwiKSwgYS5jc3MoXCJyaWdodFwiLCBmKSlcclxuICAgIH0sIHRoaXMuQ29uc3RyYWludFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIChhLmNlbnRlciA8IGIuY2VudGVyICYmIGEub3V0ZXJSaWdodCA+IGIub3V0ZXJMZWZ0IHx8IGEuY2VudGVyID4gYi5jZW50ZXIgJiYgYi5vdXRlclJpZ2h0ID4gYS5vdXRlckxlZnQpICYmIChhID0gdGhpcy5nZXRMZWZ0UG9zaXRpb24oYSwgYiksIGIgPSB0aGlzLmdldFJpZ2h0UG9zaXRpb24oYSwgYikpXHJcbiAgICB9LCB0aGlzLmdldExlZnRQb3NpdGlvbiA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHZhciBjID0gKGIuY2VudGVyICsgYS5jZW50ZXIpIC8gMiwgZCA9IGMgLSBhLmNhY2hlLm91dGVyV2lkdGggLSBhLmNhY2hlLm1hcmdpbi5yaWdodCArIGEuY2FjaGUuYm9yZGVyLmxlZnQ7XHJcbiAgICAgIHJldHVybiBhLmxlZnQgPSBkLCBhXHJcbiAgICB9LCB0aGlzLmdldFJpZ2h0UG9zaXRpb24gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB2YXIgYyA9IChiLmNlbnRlciArIGEuY2VudGVyKSAvIDI7XHJcbiAgICAgIHJldHVybiBiLmxlZnQgPSBjICsgYi5jYWNoZS5tYXJnaW4ubGVmdCArIGIuY2FjaGUuYm9yZGVyLmxlZnQsIGJcclxuICAgIH0sIHRoaXMuU2hvd0lmTmVjZXNzYXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBcInNob3dcIiA9PT0gdGhpcy5vcHRpb25zLnNob3cgfHwgdGhpcy5tb3ZpbmcgfHwgIXRoaXMuaW5pdGlhbGl6ZWQgfHwgdGhpcy51cGRhdGluZyB8fCAodGhpcy5sYWJlbDEuc3RvcCghMCwgITApLmZhZGVJbih0aGlzLm9wdGlvbnMuZHVyYXRpb25JbiB8fCAwKSwgdGhpcy5sYWJlbDIuc3RvcCghMCwgITApLmZhZGVJbih0aGlzLm9wdGlvbnMuZHVyYXRpb25JbiB8fCAwKSwgdGhpcy5tb3ZpbmcgPSAhMClcclxuICAgIH0sIHRoaXMuSGlkZUlmTmVlZGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm1vdmluZyA9PT0gITAgJiYgKHRoaXMubGFiZWwxLnN0b3AoITAsICEwKS5kZWxheSh0aGlzLm9wdGlvbnMuZGVsYXlPdXQgfHwgMCkuZmFkZU91dCh0aGlzLm9wdGlvbnMuZHVyYXRpb25PdXQgfHwgMCksIHRoaXMubGFiZWwyLnN0b3AoITAsICEwKS5kZWxheSh0aGlzLm9wdGlvbnMuZGVsYXlPdXQgfHwgMCkuZmFkZU91dCh0aGlzLm9wdGlvbnMuZHVyYXRpb25PdXQgfHwgMCksIHRoaXMubW92aW5nID0gITEpXHJcbiAgICB9LCB0aGlzLm9uSGFuZGxlTW92aW5nID0gZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgdGhpcy5TaG93SWZOZWNlc3NhcnkoKSwgdGhpcy5DYWNoZUlmTmVjZXNzYXJ5KCksIHRoaXMuVXBkYXRlSGFuZGxlUG9zaXRpb24oYiksIHRoaXMuUG9zaXRpb25MYWJlbHMoKVxyXG4gICAgfSwgdGhpcy5vbkhhbmRsZVVwZGF0aW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnVwZGF0aW5nID0gITBcclxuICAgIH0sIHRoaXMub25IYW5kbGVVcGRhdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnVwZGF0aW5nID0gITEsIHRoaXMuY2FjaGUgPSBudWxsXHJcbiAgICB9LCB0aGlzLm9uSGFuZGxlU3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5IaWRlSWZOZWVkZWQoKVxyXG4gICAgfSwgdGhpcy5vbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5jYWNoZSA9IG51bGxcclxuICAgIH0sIHRoaXMuVXBkYXRlSGFuZGxlUG9zaXRpb24gPSBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBudWxsICE9PSB0aGlzLmNhY2hlICYmIChhLmVsZW1lbnRbMF0gPT09IHRoaXMuaGFuZGxlMVswXSA/IHRoaXMuVXBkYXRlUG9zaXRpb24oYSwgdGhpcy5jYWNoZS5oYW5kbGUxKSA6IHRoaXMuVXBkYXRlUG9zaXRpb24oYSwgdGhpcy5jYWNoZS5oYW5kbGUyKSlcclxuICAgIH0sIHRoaXMuVXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBiLm9mZnNldCA9IGEub2Zmc2V0LCBiLnZhbHVlID0gYS52YWx1ZVxyXG4gICAgfSwgdGhpcy5HZXRSYXdQb3NpdGlvbiA9IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHZhciBjID0gYi5vZmZzZXQubGVmdCArIGIub3V0ZXJXaWR0aCAvIDIsIGQgPSBjIC0gYS5vdXRlcldpZHRoIC8gMixcclxuICAgICAgICBlID0gZCArIGEub3V0ZXJXaWR0aCAtIGEuYm9yZGVyLmxlZnQgLSBhLmJvcmRlci5yaWdodCwgZiA9IGQgLSBhLm1hcmdpbi5sZWZ0IC0gYS5ib3JkZXIubGVmdCxcclxuICAgICAgICBnID0gYi5vZmZzZXQudG9wIC0gYS5vdXRlckhlaWdodE1hcmdpbjtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWZ0OiBkLFxyXG4gICAgICAgIG91dGVyTGVmdDogZixcclxuICAgICAgICB0b3A6IGcsXHJcbiAgICAgICAgcmlnaHQ6IGUsXHJcbiAgICAgICAgb3V0ZXJSaWdodDogZiArIGEub3V0ZXJXaWR0aCArIGEubWFyZ2luLmxlZnQgKyBhLm1hcmdpbi5yaWdodCxcclxuICAgICAgICBjYWNoZTogYSxcclxuICAgICAgICBjZW50ZXI6IGNcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcy5Jbml0KClcclxuICB9XHJcblxyXG4gIGEud2lkZ2V0KFwidWkucmFuZ2VTbGlkZXJMYWJlbFwiLCBhLnVpLnJhbmdlU2xpZGVyTW91c2VUb3VjaCwge1xyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBoYW5kbGU6IG51bGwsXHJcbiAgICAgIGZvcm1hdHRlcjogITEsXHJcbiAgICAgIGhhbmRsZVR5cGU6IFwicmFuZ2VTbGlkZXJIYW5kbGVcIixcclxuICAgICAgc2hvdzogXCJzaG93XCIsXHJcbiAgICAgIGR1cmF0aW9uSW46IDAsXHJcbiAgICAgIGR1cmF0aW9uT3V0OiA1MDAsXHJcbiAgICAgIGRlbGF5T3V0OiA1MDAsXHJcbiAgICAgIGlzTGVmdDogITFcclxuICAgIH0sIGNhY2hlOiBudWxsLCBfcG9zaXRpb25uZXI6IG51bGwsIF92YWx1ZUNvbnRhaW5lcjogbnVsbCwgX2lubmVyRWxlbWVudDogbnVsbCwgX3ZhbHVlOiBudWxsLCBfY3JlYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5pc0xlZnQgPSB0aGlzLl9oYW5kbGUoXCJvcHRpb25cIiwgXCJpc0xlZnRcIiksIHRoaXMuZWxlbWVudC5hZGRDbGFzcyhcInVpLXJhbmdlU2xpZGVyLWxhYmVsXCIpLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpLCB0aGlzLl9jcmVhdGVFbGVtZW50cygpLCB0aGlzLl90b2dnbGVDbGFzcygpLCB0aGlzLm9wdGlvbnMuaGFuZGxlLmJpbmQoXCJtb3ZpbmcubGFiZWxcIiwgYS5wcm94eSh0aGlzLl9vbk1vdmluZywgdGhpcykpLmJpbmQoXCJ1cGRhdGUubGFiZWxcIiwgYS5wcm94eSh0aGlzLl9vblVwZGF0ZSwgdGhpcykpLmJpbmQoXCJzd2l0Y2gubGFiZWxcIiwgYS5wcm94eSh0aGlzLl9vblN3aXRjaCwgdGhpcykpLCBcInNob3dcIiAhPT0gdGhpcy5vcHRpb25zLnNob3cgJiYgdGhpcy5lbGVtZW50LmhpZGUoKSwgdGhpcy5fbW91c2VJbml0KClcclxuICAgIH0sIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLmhhbmRsZS51bmJpbmQoXCIubGFiZWxcIiksIHRoaXMub3B0aW9ucy5oYW5kbGUgPSBudWxsLCB0aGlzLl92YWx1ZUNvbnRhaW5lciA9IG51bGwsIHRoaXMuX2lubmVyRWxlbWVudCA9IG51bGwsIHRoaXMuZWxlbWVudC5lbXB0eSgpLCB0aGlzLl9wb3NpdGlvbm5lciAmJiAodGhpcy5fcG9zaXRpb25uZXIuRGVzdHJveSgpLCB0aGlzLl9wb3NpdGlvbm5lciA9IG51bGwpLCBhLnVpLnJhbmdlU2xpZGVyTW91c2VUb3VjaC5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKVxyXG4gICAgfSwgX2NyZWF0ZUVsZW1lbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3ZhbHVlQ29udGFpbmVyID0gYShcIjxkaXYgY2xhc3M9J3VpLXJhbmdlU2xpZGVyLWxhYmVsLXZhbHVlJyAvPlwiKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpLCB0aGlzLl9pbm5lckVsZW1lbnQgPSBhKFwiPGRpdiBjbGFzcz0ndWktcmFuZ2VTbGlkZXItbGFiZWwtaW5uZXInIC8+XCIpLmFwcGVuZFRvKHRoaXMuZWxlbWVudClcclxuICAgIH0sIF9oYW5kbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzKTtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5oYW5kbGVbdGhpcy5vcHRpb25zLmhhbmRsZVR5cGVdLmFwcGx5KHRoaXMub3B0aW9ucy5oYW5kbGUsIGEpXHJcbiAgICB9LCBfc2V0T3B0aW9uOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBcInNob3dcIiA9PT0gYSA/IHRoaXMuX3VwZGF0ZVNob3dPcHRpb24oYikgOiAoXCJkdXJhdGlvbkluXCIgPT09IGEgfHwgXCJkdXJhdGlvbk91dFwiID09PSBhIHx8IFwiZGVsYXlPdXRcIiA9PT0gYSkgJiYgdGhpcy5fdXBkYXRlRHVyYXRpb25zKGEsIGIpLCB0aGlzLl9zZXRGb3JtYXR0ZXJPcHRpb24oYSwgYilcclxuICAgIH0sIF9zZXRGb3JtYXR0ZXJPcHRpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIFwiZm9ybWF0dGVyXCIgPT09IGEgJiYgKFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgYiB8fCBiID09PSAhMSkgJiYgKHRoaXMub3B0aW9ucy5mb3JtYXR0ZXIgPSBiLCB0aGlzLl9kaXNwbGF5KHRoaXMuX3ZhbHVlKSlcclxuICAgIH0sIF91cGRhdGVTaG93T3B0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuc2hvdyA9IGEsIFwic2hvd1wiICE9PSB0aGlzLm9wdGlvbnMuc2hvdyA/ICh0aGlzLmVsZW1lbnQuaGlkZSgpLCB0aGlzLl9wb3NpdGlvbm5lci5tb3ZpbmcgPSAhMSkgOiAodGhpcy5lbGVtZW50LnNob3coKSwgdGhpcy5fZGlzcGxheSh0aGlzLm9wdGlvbnMuaGFuZGxlW3RoaXMub3B0aW9ucy5oYW5kbGVUeXBlXShcInZhbHVlXCIpKSwgdGhpcy5fcG9zaXRpb25uZXIuUG9zaXRpb25MYWJlbHMoKSksIHRoaXMuX3Bvc2l0aW9ubmVyLm9wdGlvbnMuc2hvdyA9IHRoaXMub3B0aW9ucy5zaG93XHJcbiAgICB9LCBfdXBkYXRlRHVyYXRpb25zOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBwYXJzZUludChiLCAxMCkgPT09IGIgJiYgKHRoaXMuX3Bvc2l0aW9ubmVyLm9wdGlvbnNbYV0gPSBiLCB0aGlzLm9wdGlvbnNbYV0gPSBiKVxyXG4gICAgfSwgX2Rpc3BsYXk6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5mb3JtYXR0ZXIgPT09ICExID8gdGhpcy5fZGlzcGxheVRleHQoTWF0aC5yb3VuZChhKSkgOiB0aGlzLl9kaXNwbGF5VGV4dCh0aGlzLm9wdGlvbnMuZm9ybWF0dGVyKGEpKSwgdGhpcy5fdmFsdWUgPSBhXHJcbiAgICB9LCBfZGlzcGxheVRleHQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMuX3ZhbHVlQ29udGFpbmVyLnRleHQoYSlcclxuICAgIH0sIF90b2dnbGVDbGFzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1sZWZ0TGFiZWxcIiwgdGhpcy5vcHRpb25zLmlzTGVmdCkudG9nZ2xlQ2xhc3MoXCJ1aS1yYW5nZVNsaWRlci1yaWdodExhYmVsXCIsICF0aGlzLm9wdGlvbnMuaXNMZWZ0KVxyXG4gICAgfSwgX3Bvc2l0aW9uTGFiZWxzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3Bvc2l0aW9ubmVyLlBvc2l0aW9uTGFiZWxzKClcclxuICAgIH0sIF9tb3VzZURvd246IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5oYW5kbGUudHJpZ2dlcihhKVxyXG4gICAgfSwgX21vdXNlVXA6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5oYW5kbGUudHJpZ2dlcihhKVxyXG4gICAgfSwgX21vdXNlTW92ZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLmhhbmRsZS50cmlnZ2VyKGEpXHJcbiAgICB9LCBfb25Nb3Zpbmc6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHRoaXMuX2Rpc3BsYXkoYi52YWx1ZSlcclxuICAgIH0sIF9vblVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBcInNob3dcIiA9PT0gdGhpcy5vcHRpb25zLnNob3cgJiYgdGhpcy51cGRhdGUoKVxyXG4gICAgfSwgX29uU3dpdGNoOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuaXNMZWZ0ID0gYiwgdGhpcy5fdG9nZ2xlQ2xhc3MoKSwgdGhpcy5fcG9zaXRpb25MYWJlbHMoKVxyXG4gICAgfSwgcGFpcjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgbnVsbCA9PT0gdGhpcy5fcG9zaXRpb25uZXIgJiYgKHRoaXMuX3Bvc2l0aW9ubmVyID0gbmV3IGModGhpcy5lbGVtZW50LCBhLCB0aGlzLndpZGdldE5hbWUsIHtcclxuICAgICAgICBzaG93OiB0aGlzLm9wdGlvbnMuc2hvdyxcclxuICAgICAgICBkdXJhdGlvbkluOiB0aGlzLm9wdGlvbnMuZHVyYXRpb25JbixcclxuICAgICAgICBkdXJhdGlvbk91dDogdGhpcy5vcHRpb25zLmR1cmF0aW9uT3V0LFxyXG4gICAgICAgIGRlbGF5T3V0OiB0aGlzLm9wdGlvbnMuZGVsYXlPdXRcclxuICAgICAgfSksIGFbdGhpcy53aWRnZXROYW1lXShcInBvc2l0aW9ubmVyXCIsIHRoaXMuX3Bvc2l0aW9ubmVyKSlcclxuICAgIH0sIHBvc2l0aW9ubmVyOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgYSAmJiAodGhpcy5fcG9zaXRpb25uZXIgPSBhKSwgdGhpcy5fcG9zaXRpb25uZXJcclxuICAgIH0sIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9wb3NpdGlvbm5lci5jYWNoZSA9IG51bGwsIHRoaXMuX2Rpc3BsYXkodGhpcy5faGFuZGxlKFwidmFsdWVcIikpLCBcInNob3dcIiA9PT0gdGhpcy5vcHRpb25zLnNob3cgJiYgdGhpcy5fcG9zaXRpb25MYWJlbHMoKVxyXG4gICAgfVxyXG4gIH0pXHJcbn0oalF1ZXJ5KSwgZnVuY3Rpb24gKGEsIGIpIHtcclxuICBcInVzZSBzdHJpY3RcIjtcclxuICBhLndpZGdldChcInVpLmRhdGVSYW5nZVNsaWRlclwiLCBhLnVpLnJhbmdlU2xpZGVyLCB7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIGJvdW5kczoge1xyXG4gICAgICAgIG1pbjogbmV3IERhdGUoMjAxMCwgMCwgMSkudmFsdWVPZigpLFxyXG4gICAgICAgIG1heDogbmV3IERhdGUoMjAxMiwgMCwgMSkudmFsdWVPZigpXHJcbiAgICAgIH0sIGRlZmF1bHRWYWx1ZXM6IHttaW46IG5ldyBEYXRlKDIwMTAsIDEsIDExKS52YWx1ZU9mKCksIG1heDogbmV3IERhdGUoMjAxMSwgMSwgMTEpLnZhbHVlT2YoKX1cclxuICAgIH0sIF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuX2NyZWF0ZS5hcHBseSh0aGlzKSwgdGhpcy5lbGVtZW50LmFkZENsYXNzKFwidWktZGF0ZVJhbmdlU2xpZGVyXCIpXHJcbiAgICB9LCBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyhcInVpLWRhdGVSYW5nZVNsaWRlclwiKSwgYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKVxyXG4gICAgfSwgX3NldERlZmF1bHRWYWx1ZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fdmFsdWVzID0ge21pbjogdGhpcy5vcHRpb25zLmRlZmF1bHRWYWx1ZXMubWluLnZhbHVlT2YoKSwgbWF4OiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlcy5tYXgudmFsdWVPZigpfVxyXG4gICAgfSwgX3NldFJ1bGVyUGFyYW1ldGVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnJ1bGVyLnJ1bGVyKHtcclxuICAgICAgICBtaW46IG5ldyBEYXRlKHRoaXMub3B0aW9ucy5ib3VuZHMubWluLnZhbHVlT2YoKSksXHJcbiAgICAgICAgbWF4OiBuZXcgRGF0ZSh0aGlzLm9wdGlvbnMuYm91bmRzLm1heC52YWx1ZU9mKCkpLFxyXG4gICAgICAgIHNjYWxlczogdGhpcy5vcHRpb25zLnNjYWxlc1xyXG4gICAgICB9KVxyXG4gICAgfSwgX3NldE9wdGlvbjogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgKFwiZGVmYXVsdFZhbHVlc1wiID09PSBiIHx8IFwiYm91bmRzXCIgPT09IGIpICYmIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGMgJiYgbnVsbCAhPT0gYyAmJiB0aGlzLl9pc1ZhbGlkRGF0ZShjLm1pbikgJiYgdGhpcy5faXNWYWxpZERhdGUoYy5tYXgpID8gYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuX3NldE9wdGlvbi5hcHBseSh0aGlzLCBbYiwge1xyXG4gICAgICAgIG1pbjogYy5taW4udmFsdWVPZigpLFxyXG4gICAgICAgIG1heDogYy5tYXgudmFsdWVPZigpXHJcbiAgICAgIH1dKSA6IGEudWkucmFuZ2VTbGlkZXIucHJvdG90eXBlLl9zZXRPcHRpb24uYXBwbHkodGhpcywgdGhpcy5fdG9BcnJheShhcmd1bWVudHMpKVxyXG4gICAgfSwgX2hhbmRsZVR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFwiZGF0ZVJhbmdlU2xpZGVySGFuZGxlXCJcclxuICAgIH0sIG9wdGlvbjogZnVuY3Rpb24gKGIpIHtcclxuICAgICAgaWYgKFwiYm91bmRzXCIgPT09IGIgfHwgXCJkZWZhdWx0VmFsdWVzXCIgPT09IGIpIHtcclxuICAgICAgICB2YXIgYyA9IGEudWkucmFuZ2VTbGlkZXIucHJvdG90eXBlLm9wdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHJldHVybiB7bWluOiBuZXcgRGF0ZShjLm1pbiksIG1heDogbmV3IERhdGUoYy5tYXgpfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhLnVpLnJhbmdlU2xpZGVyLnByb3RvdHlwZS5vcHRpb24uYXBwbHkodGhpcywgdGhpcy5fdG9BcnJheShhcmd1bWVudHMpKVxyXG4gICAgfSwgX2RlZmF1bHRGb3JtYXR0ZXI6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHZhciBiID0gYS5nZXRNb250aCgpICsgMSwgYyA9IGEuZ2V0RGF0ZSgpO1xyXG4gICAgICByZXR1cm4gXCJcIiArIGEuZ2V0RnVsbFllYXIoKSArIFwiLVwiICsgKDEwID4gYiA/IFwiMFwiICsgYiA6IGIpICsgXCItXCIgKyAoMTAgPiBjID8gXCIwXCIgKyBjIDogYylcclxuICAgIH0sIF9nZXRGb3JtYXR0ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGEgPSB0aGlzLm9wdGlvbnMuZm9ybWF0dGVyO1xyXG4gICAgICByZXR1cm4gKHRoaXMub3B0aW9ucy5mb3JtYXR0ZXIgPT09ICExIHx8IG51bGwgPT09IHRoaXMub3B0aW9ucy5mb3JtYXR0ZXIpICYmIChhID0gdGhpcy5fZGVmYXVsdEZvcm1hdHRlciksIGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgICAgICByZXR1cm4gYShuZXcgRGF0ZShiKSlcclxuICAgICAgICB9XHJcbiAgICAgIH0oYSlcclxuICAgIH0sIHZhbHVlczogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgdmFyIGQgPSBudWxsO1xyXG4gICAgICByZXR1cm4gZCA9IHRoaXMuX2lzVmFsaWREYXRlKGIpICYmIHRoaXMuX2lzVmFsaWREYXRlKGMpID8gYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUudmFsdWVzLmFwcGx5KHRoaXMsIFtiLnZhbHVlT2YoKSwgYy52YWx1ZU9mKCldKSA6IGEudWkucmFuZ2VTbGlkZXIucHJvdG90eXBlLnZhbHVlcy5hcHBseSh0aGlzLCB0aGlzLl90b0FycmF5KGFyZ3VtZW50cykpLCB7XHJcbiAgICAgICAgbWluOiBuZXcgRGF0ZShkLm1pbiksXHJcbiAgICAgICAgbWF4OiBuZXcgRGF0ZShkLm1heClcclxuICAgICAgfVxyXG4gICAgfSwgbWluOiBmdW5jdGlvbiAoYikge1xyXG4gICAgICByZXR1cm4gdGhpcy5faXNWYWxpZERhdGUoYikgPyBuZXcgRGF0ZShhLnVpLnJhbmdlU2xpZGVyLnByb3RvdHlwZS5taW4uYXBwbHkodGhpcywgW2IudmFsdWVPZigpXSkpIDogbmV3IERhdGUoYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUubWluLmFwcGx5KHRoaXMpKVxyXG4gICAgfSwgbWF4OiBmdW5jdGlvbiAoYikge1xyXG4gICAgICByZXR1cm4gdGhpcy5faXNWYWxpZERhdGUoYikgPyBuZXcgRGF0ZShhLnVpLnJhbmdlU2xpZGVyLnByb3RvdHlwZS5tYXguYXBwbHkodGhpcywgW2IudmFsdWVPZigpXSkpIDogbmV3IERhdGUoYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUubWF4LmFwcGx5KHRoaXMpKVxyXG4gICAgfSwgYm91bmRzOiBmdW5jdGlvbiAoYiwgYykge1xyXG4gICAgICB2YXIgZDtcclxuICAgICAgcmV0dXJuIGQgPSB0aGlzLl9pc1ZhbGlkRGF0ZShiKSAmJiB0aGlzLl9pc1ZhbGlkRGF0ZShjKSA/IGEudWkucmFuZ2VTbGlkZXIucHJvdG90eXBlLmJvdW5kcy5hcHBseSh0aGlzLCBbYi52YWx1ZU9mKCksIGMudmFsdWVPZigpXSkgOiBhLnVpLnJhbmdlU2xpZGVyLnByb3RvdHlwZS5ib3VuZHMuYXBwbHkodGhpcywgdGhpcy5fdG9BcnJheShhcmd1bWVudHMpKSwge1xyXG4gICAgICAgIG1pbjogbmV3IERhdGUoZC5taW4pLFxyXG4gICAgICAgIG1heDogbmV3IERhdGUoZC5tYXgpXHJcbiAgICAgIH1cclxuICAgIH0sIF9pc1ZhbGlkRGF0ZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIGEgJiYgYSBpbnN0YW5jZW9mIERhdGVcclxuICAgIH0sIF90b0FycmF5OiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYSlcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5kYXRlUmFuZ2VTbGlkZXJIYW5kbGVcIiwgYS51aS5yYW5nZVNsaWRlckhhbmRsZSwge1xyXG4gICAgX3N0ZXBzOiAhMSwgX2JvdW5kc1ZhbHVlczoge30sIF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fY3JlYXRlQm91bmRzVmFsdWVzKCksIGEudWkucmFuZ2VTbGlkZXJIYW5kbGUucHJvdG90eXBlLl9jcmVhdGUuYXBwbHkodGhpcylcclxuICAgIH0sIF9nZXRWYWx1ZUZvclBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHRoaXMuX2dldFJhd1ZhbHVlRm9yUG9zaXRpb25BbmRCb3VuZHMoYSwgdGhpcy5vcHRpb25zLmJvdW5kcy5taW4udmFsdWVPZigpLCB0aGlzLm9wdGlvbnMuYm91bmRzLm1heC52YWx1ZU9mKCkpO1xyXG4gICAgICByZXR1cm4gdGhpcy5fY29uc3RyYWludFZhbHVlKG5ldyBEYXRlKGIpKVxyXG4gICAgfSwgX3NldE9wdGlvbjogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgcmV0dXJuIFwic3RlcFwiID09PSBiID8gKHRoaXMub3B0aW9ucy5zdGVwID0gYywgdGhpcy5fY3JlYXRlU3RlcHMoKSwgdm9pZCB0aGlzLnVwZGF0ZSgpKSA6IChhLnVpLnJhbmdlU2xpZGVySGFuZGxlLnByb3RvdHlwZS5fc2V0T3B0aW9uLmFwcGx5KHRoaXMsIFtiLCBjXSksIHZvaWQoXCJib3VuZHNcIiA9PT0gYiAmJiB0aGlzLl9jcmVhdGVCb3VuZHNWYWx1ZXMoKSkpXHJcbiAgICB9LCBfY3JlYXRlQm91bmRzVmFsdWVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2JvdW5kc1ZhbHVlcyA9IHttaW46IHRoaXMub3B0aW9ucy5ib3VuZHMubWluLnZhbHVlT2YoKSwgbWF4OiB0aGlzLm9wdGlvbnMuYm91bmRzLm1heC52YWx1ZU9mKCl9XHJcbiAgICB9LCBfYm91bmRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9ib3VuZHNWYWx1ZXNcclxuICAgIH0sIF9jcmVhdGVTdGVwczogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0ZXAgPT09ICExIHx8ICF0aGlzLl9pc1ZhbGlkU3RlcCgpKXJldHVybiB2b2lkKHRoaXMuX3N0ZXBzID0gITEpO1xyXG4gICAgICB2YXIgYSA9IG5ldyBEYXRlKHRoaXMub3B0aW9ucy5ib3VuZHMubWluLnZhbHVlT2YoKSksIGIgPSBuZXcgRGF0ZSh0aGlzLm9wdGlvbnMuYm91bmRzLm1heC52YWx1ZU9mKCkpLCBjID0gYSxcclxuICAgICAgICBkID0gMCwgZSA9IG5ldyBEYXRlO1xyXG4gICAgICBmb3IgKHRoaXMuX3N0ZXBzID0gW107IGIgPj0gYyAmJiAoMSA9PT0gZCB8fCBlLnZhbHVlT2YoKSAhPT0gYy52YWx1ZU9mKCkpOyllID0gYywgdGhpcy5fc3RlcHMucHVzaChjLnZhbHVlT2YoKSksIGMgPSB0aGlzLl9hZGRTdGVwKGEsIGQsIHRoaXMub3B0aW9ucy5zdGVwKSwgZCsrO1xyXG4gICAgICBlLnZhbHVlT2YoKSA9PT0gYy52YWx1ZU9mKCkgJiYgKHRoaXMuX3N0ZXBzID0gITEpXHJcbiAgICB9LCBfaXNWYWxpZFN0ZXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFwib2JqZWN0XCIgPT0gdHlwZW9mIHRoaXMub3B0aW9ucy5zdGVwXHJcbiAgICB9LCBfYWRkU3RlcDogZnVuY3Rpb24gKGEsIGIsIGMpIHtcclxuICAgICAgdmFyIGQgPSBuZXcgRGF0ZShhLnZhbHVlT2YoKSk7XHJcbiAgICAgIHJldHVybiBkID0gdGhpcy5fYWRkVGhpbmcoZCwgXCJGdWxsWWVhclwiLCBiLCBjLnllYXJzKSwgZCA9IHRoaXMuX2FkZFRoaW5nKGQsIFwiTW9udGhcIiwgYiwgYy5tb250aHMpLCBkID0gdGhpcy5fYWRkVGhpbmcoZCwgXCJEYXRlXCIsIGIsIDcgKiBjLndlZWtzKSwgZCA9IHRoaXMuX2FkZFRoaW5nKGQsIFwiRGF0ZVwiLCBiLCBjLmRheXMpLCBkID0gdGhpcy5fYWRkVGhpbmcoZCwgXCJIb3Vyc1wiLCBiLCBjLmhvdXJzKSwgZCA9IHRoaXMuX2FkZFRoaW5nKGQsIFwiTWludXRlc1wiLCBiLCBjLm1pbnV0ZXMpLCBkID0gdGhpcy5fYWRkVGhpbmcoZCwgXCJTZWNvbmRzXCIsIGIsIGMuc2Vjb25kcylcclxuICAgIH0sIF9hZGRUaGluZzogZnVuY3Rpb24gKGEsIGIsIGMsIGQpIHtcclxuICAgICAgcmV0dXJuIDAgPT09IGMgfHwgMCA9PT0gKGQgfHwgMCkgPyBhIDogKGFbXCJzZXRcIiArIGJdKGFbXCJnZXRcIiArIGJdKCkgKyBjICogKGQgfHwgMCkpLCBhKVxyXG4gICAgfSwgX3JvdW5kOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICBpZiAodGhpcy5fc3RlcHMgPT09ICExKXJldHVybiBhO1xyXG4gICAgICBmb3IgKHZhciBiLCBjLCBkID0gdGhpcy5vcHRpb25zLmJvdW5kcy5tYXgudmFsdWVPZigpLCBlID0gdGhpcy5vcHRpb25zLmJvdW5kcy5taW4udmFsdWVPZigpLFxyXG4gICAgICAgICAgICAgZiA9IE1hdGgubWF4KDAsIChhIC0gZSkgLyAoZCAtIGUpKSwgZyA9IE1hdGguZmxvb3IodGhpcy5fc3RlcHMubGVuZ3RoICogZik7IHRoaXMuX3N0ZXBzW2ddID4gYTspZy0tO1xyXG4gICAgICBmb3IgKDsgZyArIDEgPCB0aGlzLl9zdGVwcy5sZW5ndGggJiYgdGhpcy5fc3RlcHNbZyArIDFdIDw9IGE7KWcrKztcclxuICAgICAgcmV0dXJuIGcgPj0gdGhpcy5fc3RlcHMubGVuZ3RoIC0gMSA/IHRoaXMuX3N0ZXBzW3RoaXMuX3N0ZXBzLmxlbmd0aCAtIDFdIDogMCA9PT0gZyA/IHRoaXMuX3N0ZXBzWzBdIDogKGIgPSB0aGlzLl9zdGVwc1tnXSwgYyA9IHRoaXMuX3N0ZXBzW2cgKyAxXSwgYyAtIGEgPiBhIC0gYiA/IGIgOiBjKVxyXG4gICAgfSwgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2NyZWF0ZUJvdW5kc1ZhbHVlcygpLCB0aGlzLl9jcmVhdGVTdGVwcygpLCBhLnVpLnJhbmdlU2xpZGVySGFuZGxlLnByb3RvdHlwZS51cGRhdGUuYXBwbHkodGhpcylcclxuICAgIH0sIGFkZDogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2FkZFN0ZXAobmV3IERhdGUoYSksIDEsIGIpLnZhbHVlT2YoKVxyXG4gICAgfSwgc3Vic3RyYWN0OiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gdGhpcy5fYWRkU3RlcChuZXcgRGF0ZShhKSwgLTEsIGIpLnZhbHVlT2YoKVxyXG4gICAgfSwgc3RlcHNCZXR3ZWVuOiBmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnN0ZXAgPT09ICExKXJldHVybiBiIC0gYTtcclxuICAgICAgdmFyIGMgPSBNYXRoLm1pbihhLCBiKSwgZCA9IE1hdGgubWF4KGEsIGIpLCBlID0gMCwgZiA9ICExLCBnID0gYSA+IGI7XHJcbiAgICAgIGZvciAodGhpcy5hZGQoYywgdGhpcy5vcHRpb25zLnN0ZXApIC0gYyA8IDAgJiYgKGYgPSAhMCk7IGQgPiBjOylmID8gZCA9IHRoaXMuYWRkKGQsIHRoaXMub3B0aW9ucy5zdGVwKSA6IGMgPSB0aGlzLmFkZChjLCB0aGlzLm9wdGlvbnMuc3RlcCksIGUrKztcclxuICAgICAgcmV0dXJuIGcgPyAtZSA6IGVcclxuICAgIH0sIG11bHRpcGx5U3RlcDogZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgdmFyIGMgPSB7fTtcclxuICAgICAgZm9yICh2YXIgZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkgJiYgKGNbZF0gPSBhW2RdICogYik7XHJcbiAgICAgIHJldHVybiBjXHJcbiAgICB9LCBzdGVwUmF0aW86IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdGVwID09PSAhMSlyZXR1cm4gMTtcclxuICAgICAgdmFyIGEgPSB0aGlzLl9zdGVwcy5sZW5ndGg7XHJcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLnBhcmVudC53aWR0aCAvIGFcclxuICAgIH1cclxuICB9KVxyXG59KGpRdWVyeSksIGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgYS53aWRnZXQoXCJ1aS5lZGl0UmFuZ2VTbGlkZXJcIiwgYS51aS5yYW5nZVNsaWRlciwge1xyXG4gICAgb3B0aW9uczoge3R5cGU6IFwidGV4dFwiLCByb3VuZDogMX0sIF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuX2NyZWF0ZS5hcHBseSh0aGlzKSwgdGhpcy5lbGVtZW50LmFkZENsYXNzKFwidWktZWRpdFJhbmdlU2xpZGVyXCIpXHJcbiAgICB9LCBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyhcInVpLWVkaXRSYW5nZVNsaWRlclwiKSwgYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKVxyXG4gICAgfSwgX3NldE9wdGlvbjogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgKFwidHlwZVwiID09PSBiIHx8IFwic3RlcFwiID09PSBiKSAmJiB0aGlzLl9zZXRMYWJlbE9wdGlvbihiLCBjKSwgXCJ0eXBlXCIgPT09IGIgJiYgKHRoaXMub3B0aW9uc1tiXSA9IG51bGwgPT09IHRoaXMubGFiZWxzLmxlZnQgPyBjIDogdGhpcy5fbGVmdExhYmVsKFwib3B0aW9uXCIsIGIpKSwgYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuX3NldE9wdGlvbi5hcHBseSh0aGlzLCBbYiwgY10pXHJcbiAgICB9LCBfc2V0TGFiZWxPcHRpb246IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIG51bGwgIT09IHRoaXMubGFiZWxzLmxlZnQgJiYgKHRoaXMuX2xlZnRMYWJlbChcIm9wdGlvblwiLCBhLCBiKSwgdGhpcy5fcmlnaHRMYWJlbChcIm9wdGlvblwiLCBhLCBiKSlcclxuICAgIH0sIF9sYWJlbFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFwiZWRpdFJhbmdlU2xpZGVyTGFiZWxcIlxyXG4gICAgfSwgX2NyZWF0ZUxhYmVsOiBmdW5jdGlvbiAoYiwgYykge1xyXG4gICAgICB2YXIgZCA9IGEudWkucmFuZ2VTbGlkZXIucHJvdG90eXBlLl9jcmVhdGVMYWJlbC5hcHBseSh0aGlzLCBbYiwgY10pO1xyXG4gICAgICByZXR1cm4gbnVsbCA9PT0gYiAmJiBkLmJpbmQoXCJ2YWx1ZUNoYW5nZVwiLCBhLnByb3h5KHRoaXMuX29uVmFsdWVDaGFuZ2UsIHRoaXMpKSwgZFxyXG4gICAgfSwgX2FkZFByb3BlcnRpZXNUb1BhcmFtZXRlcjogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgcmV0dXJuIGEudHlwZSA9IHRoaXMub3B0aW9ucy50eXBlLCBhLnN0ZXAgPSB0aGlzLm9wdGlvbnMuc3RlcCwgYS5pZCA9IHRoaXMuZWxlbWVudC5hdHRyKFwiaWRcIiksIGFcclxuICAgIH0sIF9nZXRMYWJlbENvbnN0cnVjdG9yUGFyYW1ldGVyczogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgdmFyIGQgPSBhLnVpLnJhbmdlU2xpZGVyLnByb3RvdHlwZS5fZ2V0TGFiZWxDb25zdHJ1Y3RvclBhcmFtZXRlcnMuYXBwbHkodGhpcywgW2IsIGNdKTtcclxuICAgICAgcmV0dXJuIHRoaXMuX2FkZFByb3BlcnRpZXNUb1BhcmFtZXRlcihkKVxyXG4gICAgfSwgX2dldExhYmVsUmVmcmVzaFBhcmFtZXRlcnM6IGZ1bmN0aW9uIChiLCBjKSB7XHJcbiAgICAgIHZhciBkID0gYS51aS5yYW5nZVNsaWRlci5wcm90b3R5cGUuX2dldExhYmVsUmVmcmVzaFBhcmFtZXRlcnMuYXBwbHkodGhpcywgW2IsIGNdKTtcclxuICAgICAgcmV0dXJuIHRoaXMuX2FkZFByb3BlcnRpZXNUb1BhcmFtZXRlcihkKVxyXG4gICAgfSwgX29uVmFsdWVDaGFuZ2U6IGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHZhciBjID0gITE7XHJcbiAgICAgIGMgPSBiLmlzTGVmdCA/IHRoaXMuX3ZhbHVlcy5taW4gIT09IHRoaXMubWluKGIudmFsdWUpIDogdGhpcy5fdmFsdWVzLm1heCAhPT0gdGhpcy5tYXgoYi52YWx1ZSksIGMgJiYgdGhpcy5fdHJpZ2dlcihcInVzZXJWYWx1ZXNDaGFuZ2VkXCIpXHJcbiAgICB9XHJcbiAgfSlcclxufShqUXVlcnkpLCBmdW5jdGlvbiAoYSkge1xyXG4gIFwidXNlIHN0cmljdFwiO1xyXG4gIGEud2lkZ2V0KFwidWkuZWRpdFJhbmdlU2xpZGVyTGFiZWxcIiwgYS51aS5yYW5nZVNsaWRlckxhYmVsLCB7XHJcbiAgICBvcHRpb25zOiB7dHlwZTogXCJ0ZXh0XCIsIHN0ZXA6ICExLCBpZDogXCJcIn0sXHJcbiAgICBfaW5wdXQ6IG51bGwsXHJcbiAgICBfdGV4dDogXCJcIixcclxuICAgIF9jcmVhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlckxhYmVsLnByb3RvdHlwZS5fY3JlYXRlLmFwcGx5KHRoaXMpLCB0aGlzLl9jcmVhdGVJbnB1dCgpXHJcbiAgICB9LFxyXG4gICAgX3NldE9wdGlvbjogZnVuY3Rpb24gKGIsIGMpIHtcclxuICAgICAgXCJ0eXBlXCIgPT09IGIgPyB0aGlzLl9zZXRUeXBlT3B0aW9uKGMpIDogXCJzdGVwXCIgPT09IGIgJiYgdGhpcy5fc2V0U3RlcE9wdGlvbihjKSwgYS51aS5yYW5nZVNsaWRlckxhYmVsLnByb3RvdHlwZS5fc2V0T3B0aW9uLmFwcGx5KHRoaXMsIFtiLCBjXSlcclxuICAgIH0sXHJcbiAgICBfY3JlYXRlSW5wdXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5faW5wdXQgPSBhKFwiPGlucHV0IHR5cGU9J1wiICsgdGhpcy5vcHRpb25zLnR5cGUgKyBcIicgLz5cIikuYWRkQ2xhc3MoXCJ1aS1lZGl0UmFuZ2VTbGlkZXItaW5wdXRWYWx1ZVwiKS5hcHBlbmRUbyh0aGlzLl92YWx1ZUNvbnRhaW5lciksIHRoaXMuX3NldElucHV0TmFtZSgpLCB0aGlzLl9pbnB1dC5iaW5kKFwia2V5dXBcIiwgYS5wcm94eSh0aGlzLl9vbktleVVwLCB0aGlzKSksIHRoaXMuX2lucHV0LmJsdXIoYS5wcm94eSh0aGlzLl9vbkNoYW5nZSwgdGhpcykpLCBcIm51bWJlclwiID09PSB0aGlzLm9wdGlvbnMudHlwZSAmJiAodGhpcy5vcHRpb25zLnN0ZXAgIT09ICExICYmIHRoaXMuX2lucHV0LmF0dHIoXCJzdGVwXCIsIHRoaXMub3B0aW9ucy5zdGVwKSwgdGhpcy5faW5wdXQuY2xpY2soYS5wcm94eSh0aGlzLl9vbkNoYW5nZSwgdGhpcykpKSwgdGhpcy5faW5wdXQudmFsKHRoaXMuX3RleHQpXHJcbiAgICB9LFxyXG4gICAgX3NldElucHV0TmFtZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgYSA9IHRoaXMub3B0aW9ucy5pc0xlZnQgPyBcImxlZnRcIiA6IFwicmlnaHRcIjtcclxuICAgICAgdGhpcy5faW5wdXQuYXR0cihcIm5hbWVcIiwgdGhpcy5vcHRpb25zLmlkICsgYSlcclxuICAgIH0sXHJcbiAgICBfb25Td2l0Y2g6IGZ1bmN0aW9uIChiLCBjKSB7XHJcbiAgICAgIGEudWkucmFuZ2VTbGlkZXJMYWJlbC5wcm90b3R5cGUuX29uU3dpdGNoLmFwcGx5KHRoaXMsIFtiLCBjXSksIHRoaXMuX3NldElucHV0TmFtZSgpXHJcbiAgICB9LFxyXG4gICAgX2Rlc3Ryb3lJbnB1dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9pbnB1dC5yZW1vdmUoKSwgdGhpcy5faW5wdXQgPSBudWxsXHJcbiAgICB9LFxyXG4gICAgX29uS2V5VXA6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHJldHVybiAxMyA9PT0gYS53aGljaCA/ICh0aGlzLl9vbkNoYW5nZShhKSwgITEpIDogdm9pZCAwXHJcbiAgICB9LFxyXG4gICAgX29uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBhID0gdGhpcy5fcmV0dXJuQ2hlY2tlZFZhbHVlKHRoaXMuX2lucHV0LnZhbCgpKTtcclxuICAgICAgYSAhPT0gITEgJiYgdGhpcy5fdHJpZ2dlclZhbHVlKGEpXHJcbiAgICB9LFxyXG4gICAgX3RyaWdnZXJWYWx1ZTogZnVuY3Rpb24gKGEpIHtcclxuICAgICAgdmFyIGIgPSB0aGlzLm9wdGlvbnMuaGFuZGxlW3RoaXMub3B0aW9ucy5oYW5kbGVUeXBlXShcIm9wdGlvblwiLCBcImlzTGVmdFwiKTtcclxuICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoXCJ2YWx1ZUNoYW5nZVwiLCBbe2lzTGVmdDogYiwgdmFsdWU6IGF9XSlcclxuICAgIH0sXHJcbiAgICBfcmV0dXJuQ2hlY2tlZFZhbHVlOiBmdW5jdGlvbiAoYSkge1xyXG4gICAgICB2YXIgYiA9IHBhcnNlRmxvYXQoYSk7XHJcbiAgICAgIHJldHVybiBpc05hTihiKSB8fCBpc05hTihOdW1iZXIoYSkpID8gITEgOiBiXHJcbiAgICB9LFxyXG4gICAgX3NldFR5cGVPcHRpb246IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIFwidGV4dFwiICE9PSBhICYmIFwibnVtYmVyXCIgIT09IGEgfHwgdGhpcy5vcHRpb25zLnR5cGUgPT09IGEgfHwgKHRoaXMuX2Rlc3Ryb3lJbnB1dCgpLCB0aGlzLm9wdGlvbnMudHlwZSA9IGEsIHRoaXMuX2NyZWF0ZUlucHV0KCkpXHJcbiAgICB9LFxyXG4gICAgX3NldFN0ZXBPcHRpb246IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5zdGVwID0gYSwgXCJudW1iZXJcIiA9PT0gdGhpcy5vcHRpb25zLnR5cGUgJiYgdGhpcy5faW5wdXQuYXR0cihcInN0ZXBcIiwgYSAhPT0gITEgPyBhIDogXCJhbnlcIilcclxuICAgIH0sXHJcbiAgICBfZGlzcGxheVRleHQ6IGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgIHRoaXMuX2lucHV0LnZhbChhKSwgdGhpcy5fdGV4dCA9IGFcclxuICAgIH0sXHJcbiAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlckxhYmVsLnByb3RvdHlwZS5lbmFibGUuYXBwbHkodGhpcyksIHRoaXMuX2lucHV0LmF0dHIoXCJkaXNhYmxlZFwiLCBudWxsKVxyXG4gICAgfSxcclxuICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgYS51aS5yYW5nZVNsaWRlckxhYmVsLnByb3RvdHlwZS5kaXNhYmxlLmFwcGx5KHRoaXMpLCB0aGlzLl9pbnB1dC5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKVxyXG4gICAgfVxyXG4gIH0pXHJcbn0oalF1ZXJ5KTsiXSwiZmlsZSI6ImpRQWxsUmFuZ2VTbGlkZXJzLW1pbi5qcyJ9
