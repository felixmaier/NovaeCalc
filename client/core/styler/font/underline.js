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
   * Change font underline
   *
   * @method fontUnderline
   * @static
   */
  NOVAE.Styler.prototype.fontUnderline = function() {

    var jumps = 0;

    /** Shorter syntax */
    var masterCell = NOVAE.Sheets[NOVAE.CurrentSheet].Selector.masterSelected;
    var currentMaster = masterCell.Current;
    var selectSheet = NOVAE.Sheets[NOVAE.CurrentSheet].Selector;

    /** Active master selection */
    if (selectSheet.masterSelected.Current && selectSheet.masterSelected.Current !== null) {
      if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
        this.inheritSheetMasterStyling("FontUnderlined", true, masterCell.Current);
      }
      masterCell = masterCell.Columns[masterCell.Current] || masterCell.Rows[masterCell.Current];
      /** Check if master cell exists */
      if (masterCell) {
        if (masterCell.FontUnderlined) masterCell.FontUnderlined = false;
        else masterCell.FontUnderlined = true;
      }
    }

    /** Validate all selected cells */
    NOVAE.$.validateCells();

    /** Overwrite used cells styling, if active master selection */
    if (NOVAE.Cells.Used[NOVAE.CurrentSheet][currentMaster]) {
      selectSheet.inheritMasterStyling(currentMaster, masterCell, "FontUnderlined");
    }

    /** Loop through all selected cells */
    for (var ii = 0; ii < selectSheet.SelectedCells.length; ++ii) {
      var letter = NOVAE.$.numberToAlpha(selectSheet.SelectedCells[ii].letter);
      var cellName = letter + selectSheet.SelectedCells[ii].number;
      /** User wants to disable underlined property by executing again */
      if (NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontUnderlined) {
        /** Update the font underlined */
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontUnderlined = false;
        /** Immediately update cells font underlined */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.textDecoration = "none";
      } else {
        /** Update the font underlined */
        NOVAE.Cells.Used[NOVAE.CurrentSheet][letter][cellName].FontUnderlined = true;
        /** Immediately update cells font underlined */
        jumps = NOVAE.$.getCell({ letter: selectSheet.SelectedCells[ii].letter, number: selectSheet.SelectedCells[ii].number });
        if (jumps >= 0) NOVAE.DOM.Output.children[jumps].style.textDecoration = "underline";
      }
    }

    /** Inherit style changes to slave sheets */
    if (NOVAE.Sheets[NOVAE.CurrentSheet].isMasterSheet()) {
      this.inheritSheetStyling("FontUnderlined", true);
    }

    /** Share font underline styling */
    if (NOVAE.Connector.connected) {
      var range = NOVAE.$.selectionToRange(NOVAE.Sheets[NOVAE.CurrentSheet].Selector.SelectedCells);
      NOVAE.Connector.action("updateCell", { range: range, property: "FontUnderlined", value: "true" });
    }

    /** Dont loose the selection */
    selectSheet.getSelection();

  };