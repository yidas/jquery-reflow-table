/**
 * RWD reflow table switch for mobile UI/UX by collapsing columns
 * 
 * @author  Nick Tsai <myintaer@gmail.com>
 * @version 1.0.0
 * @see     https://github.com/yidas/jquery-reflow-table
 */
(function ($, window) {

  'use strict';

  // Counter for this library
  var count = 0;

  /**
   * Main object
   * 
   * @param {element} element 
   * @param {object} options 
   */
  var ReflowTable = function(element, options) {

    // Target element initialization
    this.$table = $(element).first();

    // Options
    this.options = options || {}; 
    this.namespace;
    this.thead;
    this.autoWidth;
    this.widthRatio;
    this.widthSize;

    // Static properties
    this.className = 'reflow-table';
    this.mobileModeClassName = 'reflow-table-mobile-mode';
    this.titleAttr = 'data-th';
    this.widthRatioClassName;
    this.widthWidthClassName;
    this.eventMobileOn = 'reflow-table.mobile.on';
    this.eventMobileOff = 'reflow-table.mobile.off';

    this.init();

    return this;
  }

  /**
   * Initialization
   */
  ReflowTable.prototype.init = function() {

    /**
     * Generate a namespace for the element
     */
    var getNamespace = (function () {

      var ns;

      // First, try to get existent namespace if is init before
      var options = this.$table.data(this.className) || {};
      ns = options.namespace || null;
      // Second, try to get element ID
      ns = ns || this.$table.attr('id');
      // At least, enable unique ID generator
      if (!ns) {

        count += 1;
        ns = this.className + '-' + count;
      }

      return ns;

    }).bind(this);

    /**
     * Initialize and save options
     */
    var setOptions = (function() {

      var options = this.options;
      this.namespace = this.options.namespace || getNamespace();
      this.thead = this.options.thead || this.$table.find("thead");
      this.autoWidth = (typeof options.autoWidth !== 'undefined') ? options.autoWidth : 736;
      this.widthRatio = (typeof options.widthRatio !== 'undefined') ? options.widthRatio : '50';
      this.widthSize = (typeof options.widthSize !== 'undefined') ? options.widthSize : false;
      // Static properties
      this.widthRatioClassName = this.className + '-w-' + this.widthRatio;
      this.widthWidthClassName= this.className + '-' + this.widthSize;

      // Save options
      this.$table.data(this.className, this.options);

    }).bind(this);

    /**
     * Restore options
     */
    var restoreOptions = (function() {

      this.options = this.$table.data(this.className) || {};
      // Reset and save options
      setOptions();

      return this.options;

    }).bind(this);

    // Element check
    if (!this.$table.length)
      throw "No element selected";
    if (!this.$table.is("table"))
      throw "The element must be a table dom";

    /**
     * Update Mode
     */
    if (this.options==='update') {

      restoreOptions();
      // Life cycle for update only, there is no performance difference for deleting self object so just keeping update object.
      return this.update();
    }

    /**
     * Options Setting
     */
    setOptions();

    // Destroy the table element before initializing
    this.destroy();

    // Establish every th text for mobile mode
    this.build();

    //
    if (typeof this.options.eventMobileOn === 'function') {
      this.$table.on(this.eventMobileOn, this.options.eventMobileOn);
    }
    if (typeof this.options.eventMobileOff === 'function') {
      this.$table.on(this.eventMobileOff, this.options.eventMobileOff);
    }

    // Add class for Table Reflow
    this.$table.addClass(this.className);
    // Width Ratio setting
    if (this.widthRatio) {
      this.$table.addClass(this.widthRatioClassName);
    }
    // Width Size setting
    if (this.widthSize) {
      this.$table.addClass(this.widthWidthClassName);
    }
    // AutoWidth setting
    if (this.autoWidth) {

      var that = this;

      /**
       * Listener - Window resize detection for Table Reflow
       * 
       * To support mode switch, this library doesn't use CSS @media to implement detection.
       */
      $(window).on('resize.'+that.namespace, function() {

        // Detect mode
        if ($(window).width() <= that.autoWidth) {
          // Mobile mode
          that.mobileMode(true);
        } 
        else {
          // Non-Mobile mode
          that.mobileMode(false);
        }
      });

      // Trigger at the start
      $(window).trigger('resize.'+this.namespace);
    }
  }

  /**
   * Establishing th title to prepared td DOMs for mobile mode
   * 
   * @return {self}
   */
  ReflowTable.prototype.build = function() {

    var $table = this.$table;
    var titleAttr = this.titleAttr;

    // every th text to td data for mobile mode
    $(this.thead).find("th").each(function(key, thRow) {
      
      $table.find("tbody tr td:nth-child("+(key+1)+")")
        .attr(titleAttr, $(thRow).text());
    });

    return this;
  }

  /**
   * Switch table to mobile mode or not
   * 
   * @param {boolean} enable Enable mobile mode or not, default is true
   * @return {self}
   */
  ReflowTable.prototype.mobileMode = function(enable) {

    enable = (typeof enable !== 'undefined') ? enable : true;
    var isMobileMode = this.isMobileMode();

    // Detect enabled mode
    if (enable) {
      // Mobile mode
      this.$table.addClass(this.mobileModeClassName);
      // Event trigger of first mobile on
      if (!isMobileMode)
        this.$table.trigger($.Event(this.eventMobileOn));
    } 
    else {
      // non-Mobile mode
      this.$table.removeClass(this.mobileModeClassName);
      // Event trigger of first mobile off
      if (isMobileMode)
        this.$table.trigger($.Event(this.eventMobileOff));
    }

    return this;
  }

  /**
   * Switch table between mobile mode or original mode
   * 
   * @return {self}
   */
  ReflowTable.prototype.switchMode = function() {

    // Detect the reflow table is in mobile mode or not
    if (this.isMobileMode())
      this.mobileMode(false);
    else 
      this.mobileMode(true);
    
    return this;
  }

  /**
   * Check is in mobile mode 
   * 
   * @return {boolean}
   */
  ReflowTable.prototype.isMobileMode = function() {

    return (this.$table.hasClass(this.mobileModeClassName)) ? true : false;
  }

  /**
   * Update or re-build each Reflow Table row th title for dynamic table content
   * 
   * @return {self}
   */
  ReflowTable.prototype.update = function() {

    // Re-build only without any options
    this.build();
    return this;
  }

  /**
   * Unbind all events by same namespace
   * 
   * @return {self}
   */
  ReflowTable.prototype.unbind = function() {

    // Unbind resize listener
    $(window).off('resize.'+this.namespace);

    // Unbind all events of the table
    this.$table.off();

    return this;
  }

  /**
   * Destroy Table Reflow by same namespace
   */
  ReflowTable.prototype.destroy = function() {

    this.unbind();
    // Switch mode back
    this.mobileMode(false); 
    // Remove class for Table Reflow
    this.$table.removeClass(this.className);
    // Remove Width Ratio setting
    if (this.widthRatio) {
      this.$table.removeClass(this.widthRatioClassName);
    }
    // Remove Width Size setting
    if (this.widthSize) {
      this.$table.removeClass(this.widthWidthClassName);
    }
  }

  /**
   * Interface
   */
  // Class for single element
  window.ReflowTable = ReflowTable;
  // jQuery interface
  $.fn.reflowTable = function (options) {

    // Single/Multiple mode
    if (this.length === 1) {

      return new ReflowTable(this, options)
    } 
    else if (this.length > 1) {

      var result = [];
      // Multiple elements bundle
      this.each(function () {
        result.push(new ReflowTable(this, options));
      });

      return result;
    }
    
    return false;
  }

})(jQuery, window);