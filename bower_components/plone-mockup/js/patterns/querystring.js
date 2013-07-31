// querystring pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-patterns-select2',
  'mockup-patterns-pickadate'
], function($, Base, Select2, PickADate, undefined) {
  "use strict";

  var Criteria = function() { this.init.apply(this, arguments); };
  Criteria.prototype = {
    defaults: {
      indexWidth: '20em',
      placeholder: 'Select criteria',
      remove: 'remove line',
      results: ' items matching your search.',
      days: 'days',
      betweendt: 'to',
      klassBetweenDt: 'querystring-criteria-betweendt',
      klassWrapper: 'querystring-criteria-wrapper',
      klassIndex: 'querystring-criteria-index',
      klassOperator: 'querystring-criteria-operator',
      klassValue: 'querystring-criteria-value',
      klassRemove: 'querystring-criteria-remove',
      klassResults: 'querystring-criteria-results',
      klassClear: 'querystring-criteria-clear'
    },
    init: function($el, options, indexes, index, operator, value) {
      var self = this;

      self.options = $.extend(true, {}, self.defaults, options);
      self.indexes = indexes;
      self.indexGroups = {};

      // create wrapper criteria and append it to DOM
      self.$wrapper = $('<div/>')
              .addClass(self.options.klassWrapper)
              .appendTo($el);

      // Remove button
      self.$remove = $('<div>'+self.options.remove+'</div>')
              .addClass(self.options.klassRemove)
              .appendTo(self.$wrapper)
              .on('click', function(e) {
                self.remove();
              });

      // Index selection
      self.$index = $('<select><option></option></select>')
          .attr('placeholder', self.options.placeholder);

      // list of indexes
      $.each(self.indexes, function(value, options) {
        if (options.enabled) {
          if (!self.indexGroups[options.group]) {
            self.indexGroups[options.group] = $('<optgroup/>')
                .attr('label', options.group)
                .appendTo(self.$index);
          }
          self.indexGroups[options.group].append(
            $('<option/>')
                .attr('value', value)
                .html(options.title));
        }
      });

      // attach index select to DOM
      self.$wrapper.append(
          $('<div/>')
              .addClass(self.options.klassIndex)
              .append(self.$index));

      // add blink (select2)
      self.$index
        .patternSelect2({
            width: self.options.indexWidth,
            placeholder: self.options.placeholder
        })
        .on("change", function(e) {
          self.removeValue();
          self.createOperator(e.val);
          self.createClear();
          self.trigger('index-changed');
        });

      if (index !== undefined) {
        self.$index.select2('val', index);
        self.createOperator(index, operator, value);
        self.createClear();
      }

      self.trigger('create-criteria');
    },
    createOperator: function(index, operator, value) {
      var self = this;

      self.removeOperator();
      self.$operator = $('<select/>');

      if (self.indexes[index]) {
        $.each(self.indexes[index].operators, function(value, options) {
          $('<option/>')
              .attr('value', value)
              .html(options.title)
              .appendTo(self.$operator);
        });
      }

      // attach operators select to DOM
      self.$wrapper.append(
          $('<div/>')
              .addClass(self.options.klassOperator)
              .append(self.$operator));

      // add blink (select2)
      self.$operator
        .patternSelect2({ width: '10em' })
        .on("change", function(e) {
          self.createValue(index);
          self.createClear();
          self.trigger('operator-changed');
        });

      if (operator === undefined) {
        operator = self.$operator.select2('val');
      }

      self.$operator.select2('val', operator);
      self.createValue(index, value);

      self.trigger('create-operator');
    },
    createValue: function(index, value) {
      var self = this,
          widget = self.indexes[index].operators[self.$operator.val()].widget,
          $wrapper = $('<div/>')
            .addClass(self.options.klassValue)
            .appendTo(self.$wrapper);

      self.removeValue();

      if (widget === 'StringWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .val(value)
                .appendTo($wrapper)
                .change(function(){
                  self.trigger('value-changed');
                });

      } else if (widget === 'DateWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .patternPickadate({
                  time: false,
                  date: { format: "dd/mm/yyyy" }
                })
                .change(function(){
                  self.trigger('value-changed');
                });

      } else if (widget === 'DateRangeWidget') {
        var startwrap = $('<span/>').appendTo($wrapper);
        var startdt = $('<input type="text"/>')
                        .addClass(self.options.klassValue + '-' + widget)
                        .addClass(self.options.klassValue + '-' + widget + '-start')
                        .appendTo(startwrap)
                        .patternPickadate({
                          time: false,
                          date: { format: "dd/mm/yyyy" }
                        });
        $wrapper.append(
          $('<span/>')
            .html(self.options.betweendt)
            .addClass(self.options.klassBetweenDt)
        );
        var endwrap = $('<span/>').appendTo($wrapper);
        var enddt = $('<input type="text"/>')
                        .addClass(self.options.klassValue + '-' + widget)
                        .addClass(self.options.klassValue + '-' + widget + '-end')
                        .appendTo(endwrap)
                        .patternPickadate({
                          time: false,
                          date: { format: "dd/mm/yyyy" }
                        });
        $wrapper.find('.picker__input').change(function() {
          self.trigger('value-changed');
        });
        self.$value = [startdt, enddt];

      } else if (widget === 'RelativeDateWidget') {
        self.$value = $('<input type="text"/>')
                .after($('<span/>').html(self.options.days))
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .change(function(){
                  self.trigger('value-changed');
                });

      } else if (widget === 'ReferenceWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .change(function(){
                  self.trigger('value-changed');
                });

      } else if (widget === 'RelativePathWidget') {
        self.$value = $('<input type="text"/>')
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .change(function(){
                  self.trigger('value-changed');
                });

      } else if (widget === 'MultipleSelectionWidget') {
        self.$value = $('<select/>').attr('multiple', true)
                .addClass(self.options.klassValue + '-' + widget)
                .appendTo($wrapper)
                .change(function(){
                  self.trigger('value-changed');
                });
        if (self.indexes[index]) {
          $.each(self.indexes[index].values, function(value, options) {
            $('<option/>')
                .attr('value', value)
                .html(options.title)
                .appendTo(self.$value);
          });
        }
        self.$value.patternSelect2({ width: '250px' });
      }

      if(value !== undefined && typeof self.$value !== 'undefined') {
        self.$value.select2('val', value);
      }

      self.trigger('create-value');

    },
    createClear: function() {
      var self = this;
      self.removeClear();
      self.$clear = $('<div/>')
        .addClass(self.options.klassClear)
        .appendTo(self.$wrapper);
    },
    remove: function() {
      var self = this;
      self.trigger('remove');
      self.$remove.remove();
      self.$index.parent().remove();
      self.removeOperator();
      self.removeValue();
      self.removeClear();
      self.$wrapper.remove();
    },
    removeClear: function() {
      var self = this;
      self.trigger('remove-clear');
      if (self.$clear) {
        self.$clear.remove();
      }
    },
    removeOperator: function() {
      var self = this;
      self.trigger('remove-operator');
      if (self.$operator) {
        self.$operator.parent().remove();
      }
    },
    removeValue: function() {
      var self = this;
      self.trigger('remove-value');
      if(self.$value) {
        if($.isArray(self.$value)) { // date ranges have 2 values
          self.$value[0].parents('.querystring-criteria-value').remove();
        }
        else {
          self.$value.parents('.querystring-criteria-value').remove();
        }
      }
    },
    // builds the parameters to go into the http querystring for requesting
    // results from the query builder
    buildQueryPart: function() {
      var self = this;

      // index
      var ival = self.$index.select2('val');
      if(ival === "") { // no index selected, no query
        return "";
      }
      var istr = 'query.i:records='+ival;

      // operator
      if(typeof self.$operator === "undefined") { // no operator, no query
        return "";
      }
      var oval = self.$operator.val(),
          ostr = 'query.o:records='+oval;

      // value(s)
      var vstrbase = 'query.v:records=',
          vstrlistbase = 'query.v:records:list=',
          vstr = [];
      if(typeof self.$value === "undefined") {
        vstr.push(vstrbase);
      }
      else if($.isArray(self.$value)) { // handles only datepickers from the 'between' operator right now
        $.each(self.$value, function(i, v) {
          vstr.push(vstrlistbase + $(this).parent().find('.picker__input').val());
        });
      }
      else {
        vstr.push(vstrbase + self.$value.val());
      }

      return istr + '&' + ostr + '&' + vstr.join('&');
    },
    getJSONListStr: function() {
      var self = this;

      // index
      var ival = self.$index.select2('val');
      if(ival === "") { // no index selected, no query
        return "";
      }

      // operator
      if(typeof self.$operator === "undefined") { // no operator, no query
        return "";
      }
      var oval = self.$operator.val();

      // value(s)
      var varr = [];
      if($.isArray(self.$value)) { // handles only datepickers from the 'between' operator right now
        $.each(self.$value, function(i, v) {
          varr.push($(this).parent().find('.picker__input').val());
        });
      }
      else if(typeof self.$value !== "undefined") {
        varr.push(self.$value.val());
      }
      var vval;
      if(varr.length > 1) {
        vval = '["'+varr.join('","')+'"]';
      }
      else if(varr.length === 1) {
        vval = '"'+varr[0]+'"';
      }
      else {
        vval = '""';
      }

      return '{"i":"'+ival+'", "o":"'+oval+'", "v":'+vval+'}';
    },
    trigger: function(name) {
      this.$wrapper.trigger(name + '-criteria.querystring.patterns', [ this ]);
    },
    on: function(name, callback) {
      this.$wrapper.on(name + '-criteria.querystring.patterns', callback);
    }
  };

  var QueryString = Base.extend({
    name: 'querystring',
    defaults: {
      indexes: [],
      klassWrapper: 'querystring-wrapper',
      criteria: {},
      previewURL: 'portal_factory/@@querybuilder_html_results', // base url to use to request preview information from
      previewCountURL: 'portal_factory/@@querybuildernumberofresults',
      sorttxt: 'Sort On',
      reversetxt: 'Reversed Order',
      previewTitle: 'Preview',
      previewDescription: 'Preview of at most 10 items',
      klassSortLabel: 'querystring-sort-label',
      klassSortReverse: 'querystring-sortreverse',
      klassSortReverseLabel: 'querystring-sortreverse-label',
      klassPreviewCountWrapper: 'querystring-previewcount-wrapper',
      klassPreviewResultsWrapper: 'querystring-previewresults-wrapper',
      klassPreviewWrapper: 'querystring-preview-wrapper',
      klassPreview: 'querystring-preview',
      klassPreviewTitle: 'querystring-preview-title',
      klassPreviewDescription: 'querystring-preview-description',
      klassSortWrapper: 'querystring-sort-wrapper'
    },
    init: function() {
      var self = this;

      // hide input element
      self.$el.hide();

      // create wrapper for out criteria
      self.$wrapper = $('<div/>');
      self.$el.after(self.$wrapper);

      self.$criteriaWrapper = $('<div/>')
        .addClass(self.options.klassWrapper)
        .appendTo(self.$wrapper);

      self.$sortWrapper = $('<div/>')
        .addClass(self.options.klassSortWrapper)
        .appendTo(self.$wrapper);

      self.$previewWrapper = $('<div/>')
        .addClass(self.options.klassPreviewWrapper)
        .appendTo(self.$wrapper);

      // preview title and description
      $('<div/>')
        .addClass(self.options.klassPreviewTitle)
        .html(self.options.previewTitle)
        .appendTo(self.$previewWrapper);
      $('<div/>')
        .addClass(self.options.klassPreviewDescription)
        .html(self.options.previewDescription)
        .appendTo(self.$previewWrapper);

      self.criterias = [];

      // create populated criterias
      if (self.$el.val()) {
        $.each(JSON.parse(self.$el.val()), function(i, item) {
          self.createCriteria(item.i, item.o, item.v);
        });
      }

      // add empty criteria which enables users to create new cr
      self.createCriteria();

      // add sort/order fields
      self.createSort();

      // add criteria preview pane to see results from criteria query
      self.refreshPreviewEvent();
    },
    createCriteria: function(index, operator, value) {
      var self = this,
          criteria = new Criteria(self.$criteriaWrapper, self.options.criteria,
            self.options.indexes, index, operator, value);

      criteria.on('remove', function(e) {
        if (self.criterias[self.criterias.length-1] === criteria) {
          self.createCriteria();
        }
      });

      criteria.on('index-changed', function(e) {
        if (self.criterias[self.criterias.length-1] === criteria) {
          self.createCriteria();
        }
      });

      var doupdates = function() {
        self.refreshPreviewEvent();
        self.updateValue();
      };

      criteria.on('remove', doupdates);
      criteria.on('remove-clear', doupdates);
      criteria.on('remove-operator', doupdates);
      criteria.on('remove-value', doupdates);
      criteria.on('index-changed', doupdates);
      criteria.on('operator-changed', doupdates);
      criteria.on('create-criteria', doupdates);
      criteria.on('create-operator', doupdates);
      criteria.on('create-value', doupdates);
      criteria.on('value-changed', doupdates);

      self.criterias.push(criteria);
    },
    createSort: function() {
      var self = this;

      // elements that may exist already on the page
      var existingSortOn = $('#formfield-form-widgets-sort_on');
      var existingSortOrder = $('#formfield-form-widgets-sort_reversed');

      $('<span/>')
        .addClass(self.options.klassSortLabel)
        .html(self.options.sorttxt)
        .appendTo(self.$sortWrapper);
      self.$sortOn = $('<select/>')
        .attr('name', 'sort_on')
        .appendTo(self.$sortWrapper)
        .change(function(){
          self.refreshPreviewEvent.call(self);
          $("#form-widgets-sort_on", existingSortOn).val($(this).val());
        });

      for(var key in self.options.sortable_indexes) {
        self.$sortOn.append(
          $('<option/>')
            .attr('value', key)
            .html(self.options.indexes[key].title));
      }
      self.$sortOn.patternSelect2();

      self.$sortOrder = $("<input type='checkbox' />")
                          .attr('name', 'sort_reversed:boolean')
                          .change(function(){
                            self.refreshPreviewEvent.call(self);
                            if($(this).attr('checked') === "checked") {
                              $('.option input[type="checkbox"]', existingSortOrder)
                                .attr('checked', 'checked');
                            }
                            else {
                              $('.option input[type="checkbox"]', existingSortOrder)
                                .removeAttr('checked');
                            }
                          });


      $('<span/>')
        .addClass(self.options.klassSortReverse)
        .appendTo(self.$sortWrapper)
        .append(self.$sortOrder)
        .append(
          $('<span/>')
            .html(self.options.reversetxt)
            .addClass(self.options.klassSortReverseLabel)
        );

      // if the form already contains the sort fields, hide them! Their values
      // will be synced back and forth between the querystring's form elements
      if(existingSortOn.length >= 1 && existingSortOrder.length >= 1) {
        var reversed = $('.option input[type="checkbox"]', existingSortOrder).attr('checked') === "checked";
        var sort_on = $('#form-widgets-sort_on', existingSortOn).val();
        if(reversed) {
          self.$sortOrder.attr('checked', 'checked');
        }
        self.$sortOn.select2('val', sort_on);
        $(existingSortOn).hide();
        $(existingSortOrder).hide();
      }
    },
    refreshPreviewEvent: function() {
      var self = this;

      /* TEMPORARY */
      //if(typeof self._tmpcnt === "undefined") { self._tmpcnt = 0; }
      //self._tmpcnt++;
      /* /TEMPORARY */

      if(typeof self._preview_xhr !== "undefined") {
        self._preview_xhr.abort();
      }
      /*
      if(typeof self._count_xhr !== "undefined") {
        self._count_xhr.abort();
      }
      */
      if(typeof self.$previewPane !== "undefined") {
        self.$previewPane.remove();
      }

      var query = [], querypart;
      $.each(self.criterias, function(i, criteria) {
        querypart = criteria.buildQueryPart();
        if(querypart !== "") {
          query.push(criteria.buildQueryPart());
        }
      });

      self.$previewPane = $('<div/>')
        .addClass(self.options.klassPreview)
        .appendTo(self.$previewWrapper);

      if(query.length <= 0) {
        $('<div/>')
          .addClass(self.options.klassPreviewCountWrapper)
          .html("No results to preview")
          .prependTo(self.$previewPane);
        return; // no query means nothing to send out requests for
      }

      query.push('sort_on='+self.$sortOn.val());
      var sortorder = self.$sortOrder.attr('checked');
      if(sortorder === "checked") {
        query.push('sort_order=reverse');
      }

      /* TEMPORARY */
      //self.$previewPane.html(
      //    'refreshed ' + self._tmpcnt + ' times<br />'
      //    + (query.length > 1 ? query.join('<br />&') : query));
      /* /TEMPORARY */

      /*
      self._count_xhr = $.get(self.options.previewCountURL + '?' + query.join('&'))
          .done(function(data, stat){
            $('<div/>')
              .addClass(self.options.klassPreviewCountWrapper)
              .html(data)
              .prependTo(self.$previewPane);
          });
      */
      self._preview_xhr = $.get(self.options.previewURL + '?' + query.join('&'))
          .done(function(data, stat){
            $('<div/>')
              .addClass(self.options.klassPreviewResultsWrapper)
              .html(data)
              .appendTo(self.$previewPane);
          });
    },
    updateValue: function() {
      // updating the original input with json data in the form:
      // [
      //    {i:'index', o:'operator', v:'value'}
      // ]

      var self = this;

      var criteriastrs = [];
      $.each(self.criterias, function(i, criteria) {
        var jsonstr = criteria.getJSONListStr();
        if(jsonstr !== "") {
          criteriastrs.push(jsonstr);
        }
      });

      self.$el.val('['+criteriastrs.join(',')+']');
    }
  });

  return QueryString;

});