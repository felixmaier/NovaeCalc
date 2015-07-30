/**
 * This file is part of the NovaeCalc project.
 *
 * It is permitted to use, redistribute and/or modify this software
 * under the terms of the BSD License
 *
 * @author Felix Maier <maier.felix96@gmail.com>
 * @copyright (c) 2015 Felix Maier, @felixmaier
 *
 * You may not change or remove these lines
 *
 */

"use strict";

  /**
   * Generate a empty column
   *
   * @method generateEmptyColumn
   * @static
   */
  NOVAE.Grid.prototype.generateEmptyColumn = function() {

    var column;

    var style;

    var width = Math.floor(this.Templates.Menu.Alphabetical.style.width / 2);

    var height = this.Templates.Menu.Alphabetical.style.height;

    style = "height: " + height + "px; width: " + (width + 1) + "px;";

    var column = document.createElement(this.Templates.Menu.Alphabetical.element);

    column.setAttribute("style", style);

    column.innerHTML = " ";

    /** Append col group */
    this.generateColGroup(width - 4);

    var th = document.createElement("th");
        th.appendChild(column);

    NOVAE.DOM.TableHead.appendChild(th);

  };

  /**
   * Generate menu columns
   *
   * @method generateMenuColumn
   * @static
   */
  NOVAE.Grid.prototype.generateMenuColumn = function(letter) {

    var compiledLetter = NOVAE.$.numberToAlpha(letter);

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var width = this.Templates.Menu.Alphabetical.style.width;

    var height = this.Templates.Menu.Alphabetical.style.height;

    var style;

    var column;

    if (customCellSizes.Columns[compiledLetter]) {
      width += customCellSizes.Columns[compiledLetter].Width;
    }

    style = "height: " + height + "px; width: " + (width) + "px;";

    column = this.initialiseColumn();

    column.setAttribute("style", style);

    column.innerHTML = compiledLetter;

    var th = document.createElement("th");
        th.appendChild(column);

    document.querySelector("#table_head").appendChild(th);

    this.generateColGroup(width);

  };

  /**
   * Generate a column group
   *
   * @method generateColGroup
   * @static
   */
  NOVAE.Grid.prototype.generateColGroup = function(width) {

    var col = document.createElement("col");
        col.setAttribute("style", "width:" + width + "px;");

    NOVAE.DOM.ColumnGroup.appendChild(col);

  };

  /**
   * Initialise a column
   *
   * @method initialiseColumn
   * @static
   */
  NOVAE.Grid.prototype.initialiseColumn = function() {

    var self = this;

    var customCellSizes = NOVAE.Cells.Resized[NOVAE.CurrentSheet];

    var element = document.createElement(this.Templates.Menu.Alphabetical.element);
        element.className = this.Templates.Menu.Alphabetical.class;
        element.setAttribute("clicked", 0);
        element.setAttribute("timestamp", new Date().getTime());

    /** Mouse down */
    element.addEventListener(NOVAE.Events.mouseDown, function(e) {

      /** Double click */
      if (new Date().getTime() - parseInt(this.getAttribute("timestamp")) <= 150) {

        /** Do a master selection */
        NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelect(e.target.innerHTML);

      } else {

        this.setAttribute("timestamp", e.timeStamp);

      }

      this.setAttribute("clicked", 1);

      /** Higher layer position */
      e.target.style.zIndex = 3;

      NOVAE.Sheets[NOVAE.CurrentSheet].Input.Mouse.CellResize = true;

    });

    /** Mouse up */
    element.addEventListener(NOVAE.Events.mouseUp, function(e) {

      /** Register resize column if not registered yet */
      if (!customCellSizes.Columns[e.target.innerHTML]) {
        customCellSizes.Columns[e.target.innerHTML] = {
          Width: 0,
          Height: 0
        };
      }

      var width = customCellSizes.Columns[e.target.innerHTML].Width;

      this.setAttribute("clicked", 0);
      /** Re-render grid */
      NOVAE.Sheets[NOVAE.CurrentSheet].Input.lastAction.scrollY = false;
      this.setAttribute("timestamp", e.timeStamp);

      /** Inherit resize if myself is a master sheet */
      if (self.isMasterSheet()) {
        NOVAE.Styler.inheritResize(e.target.innerHTML, width);
      }

      /** Push change into undo stack */
      var command = NOVAE.newCommand();
          command.caller = "Resize";
          command.data = {
            name: e.target.innerHTML,
            width: width
          };

      /** Push command into the commander stack */
      NOVAE.Sheets[NOVAE.CurrentSheet].Commander.pushUndoCommand(command, true);

      /** Share column resize */
      if (NOVAE.Connector.connected) {
        NOVAE.Connector.action("resize", { type: "column", name: e.target.innerHTML, size: width });
      }

      /** Hide the resize helper */
      NOVAE.DOM.ColumnResizeHelper.style.display = "none";

    });

    /** Mouse out */
    element.addEventListener(NOVAE.Events.mouseOut, function(e) {

      this.setAttribute("clicked", 0);

    });

    /** User wants to change row size ? */
    element.addEventListener(NOVAE.Events.mouseMove, function(e) {

      var x = 0;
      var y = 0;

      /** Desktop */
      if (!NOVAE.Settings.Mobile) {

        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;

        if (e.pageX < self.mouseMoveDirection.oldX) self.mouseMoveDirection.directionX = "left";
        else if (e.pageX > self.mouseMoveDirection.oldX) self.mouseMoveDirection.directionX = "right";
        else self.mouseMoveDirection.directionX = null;

        self.mouseMoveDirection.oldX = e.pageX;

      /** Mobile */
      } else {

        x = e.touches[0].pageX - this.offsetLeft;
        y = e.touches[0].pageY - this.offsetTop;

        if (e.touches[0].pageX < self.mouseMoveDirection.oldX) self.mouseMoveDirection.directionX = "left";
        else if (e.touches[0].pageX > self.mouseMoveDirection.oldX) self.mouseMoveDirection.directionX = "right";
        else self.mouseMoveDirection.directionX = null;

        self.mouseMoveDirection.oldX = e.touches[0].pageX;

      }

      if ((x + y) >= 0) {

        e.target.style.cursor = "col-resize";

        if (e.target.getAttribute("clicked") === "1") {

          /** Show the resize helper */
          NOVAE.DOM.ColumnResizeHelper.style.display = "block";

          var resizeHelperValue = parseInt(e.target.style.left) + parseInt(e.target.style.width);

          resizeHelperValue -= Math.floor(self.CellTemplate.Width / 2.4) + 1;

          var name = e.target.innerHTML;

          /** Create custom cell scroll object */
          if (!customCellSizes.Columns[name]) {

            customCellSizes.Columns[name] = {
              Width: 0,
              Height: 0
            };
            customCellSizes.columnArray.push(NOVAE.$.alphaToNumber(name));

            /** Push change into undo stack */
            var command = NOVAE.newCommand();
                command.caller = "Resize";
                command.data = {
                  name: name,
                  width: 0
                };

            /** Push command into the commander stack */
            NOVAE.Sheets[NOVAE.CurrentSheet].Commander.pushUndoCommand(command, true);

          }

          var columnGroupElement = NOVAE.DOM.ColumnGroup.children[NOVAE.$.getChildIndex(e.target.parentNode)];

          /** User scrolls cell to right */
          if (self.mouseMoveDirection.directionX === "right") {

            columnGroupElement.style.width = (parseInt(e.target.style.width) + 3) + "px";
            e.target.style.width = (parseInt(e.target.style.width) + 3) + "px";

            /** Update customized cell object */
            customCellSizes.Columns[name].Width += 3;

            /** Update total cell resize factor */
            self.Settings.cellResizedX += 3;

            /** Update resize helper left position */
            NOVAE.DOM.ColumnResizeHelper.style.left = resizeHelperValue + 3 + "px";

          /** User scrolls cell to left */
          } else if (self.mouseMoveDirection.directionX === "left") {

            if (parseInt(e.target.style.width) >= 0) {

              columnGroupElement.style.width = (parseInt(e.target.style.width) - 3) + "px";
              e.target.style.width = (parseInt(e.target.style.width) - 3) + "px";

              /** Update customized cell object */
              customCellSizes.Columns[name].Width -= 3;

              /** Update total cell resize factor */
              self.Settings.cellResizedX -= 3;

            } else {

              columnGroupElement.style.width = self.CellTemplate.Width + "px";

              /** Update customized cell object */
              customCellSizes.Columns[name].Width = 0;

            }
            /** Update resize helper left position */
            NOVAE.DOM.ColumnResizeHelper.style.left = resizeHelperValue - 3 + "px";
          }

        }

      } else {

        e.target.style.cursor = "pointer";

      }

    });

    return (element);

  };