Caterwaul shell | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

The Caterwaul shell gives you a drop-in Caterwaul REPL that you can place on a page. It's useful for debugging, scripting, and testing things. Structurally speaking, the shell is an <input> element that
provides events for occurrences like autocompletion. You can also use Catastrophe (https://github.com/spencertipping/catastrophe) to trace the execution of shell commands.

    caterwaul.module('shell', ':all', function ($) {
      $.shell(context, compiler) = jquery in input.caterwaul_shell /modus($.shell.val, $.shell.val) /on('keydown keypress keyup', $.shell.handle_interaction)
                                                                   /val  ({context_: context, compiler_: compiler} /!$.shell.state),
      $.shell /-$.merge/ wcapture [

# State modeling

The shell is always in an edit state. History searching and autocompletion are implemented as functions over states, but you cannot set the editor to be in the "reverse-searching history" state, for
instance.

      compiler                    = $(':all'),
      val(s, self = jQuery(this)) = s ? self.data('caterwaul-shell-state', s).modus('val', s.text_).toggleClass('error', !s.is_valid()) <se> it.caret(s.selection_)
                                      : {} / self.data('caterwaul-shell-state') /-$.merge/ {text_: self.modus('val'), selection_: self.caret()} /!state,

      state(settings) = new state_ctor(settings.history_   || {before: [], after: []},                settings.values_  || [],     text,
                                       settings.selection_ || {start: text.length, end: text.length}, settings.context_ || window, settings.compiler_ || compiler) -where [text = settings.text_ || ''],

      state_ctor      = given [history, values, text, selection, context, compiler]
                              [this.history_   = history,   this.values_  = values,  this.text_     = text,
                               this.selection_ = selection, this.context_ = context, this.compiler_ = compiler, null] -se- it.prototype /-$.merge/

                        capture [is_valid() = $.parse(this.text_) -then- true -rescue- false,
                                 modify(o)  = {} / this /-$.merge/ o /!state,
                                 accept(c)  = this /~modify/ {text_:      '#{this.text_.substr(0, this.selection_.start)}#{String.fromCharCode(c)}#{this.text_.substr(this.selection_.end)}',
                                                              selection_: {start: this.selection_.start + 1, end: this.selection_.end + 1}},

                                 previous() = this.history_.before.length ? this /~modify/ {history_:   {before: this.history_.before.slice(0, this.history_.before.length - 1),
                                                                                                         after:  [this.text_] /~concat/ this.history_.after},
                                                                                            text_:      this.history_.before[this.history_.before.length - 1],
                                                                                            selection_: null} : this,

                                 next()     = this.history_.after.length  ? this /~modify/ {history_:   {before: this.history_.before /~concat/ [this.text_], after: this.history_.after.slice(1)},
                                                                                            text_:      this.history_.after[0],
                                                                                            selection_: null} : this,

                                 evaluate() = {history_: {before: this.history_.before /~concat/ this.history_.after /~concat/ [this.text_], after: []},
                                               values_:  this.values_ /~concat/ [{value: this.compiler_(this.text_, this.context_)} -rescue- {error: e}],
                                               context_: this.context_, compiler_: this.compiler_} /!state],

# Interaction

All interaction is triggered by keypress and keyup events on the input element. The element supports the obvious <enter> to execute a command, up/down to navigate through history, etc, but also supports
things like <tab> for autocompletion and Ctrl+R for history searching. Ctrl+W deletes a word backwards, Ctrl+U nukes from the cursor to the beginning of the line. This interaction is modeled in terms of
immutable state objects that can be retrieved and set by using the val() method.

      handle_interaction(e, self = jQuery(this), old_state = self.val(), new_state = interact.call(self, old_state, e)) = new_state !== old_state ? self.val(new_state) -then- false : true,

      interact(s, e) = e.type === 'keypress' ? e.which === 13 ? s.evaluate() : s.accept(e.which)
                     : e.type === 'keydown'  ? e.which === 38 ? s.previous()
                                             : e.which === 40 ? s.next() : s
                     : s]});