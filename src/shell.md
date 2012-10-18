Caterwaul shell | Spencer Tipping
Licensed under the terms of the MIT source code license

# Introduction

The Caterwaul shell gives you a drop-in Caterwaul REPL that you can place on a page. It's useful for debugging, scripting, and testing things. Structurally speaking, the shell is an <input> element that
provides events for occurrences like autocompletion. You can also use Catastrophe (https://github.com/spencertipping/catastrophe) to trace the execution of shell commands.

    caterwaul.module('shell', ':all', function ($) {
      $.shell(context, compiler) = jquery in input.caterwaul_shell /modus($.shell.val, $.shell.val) /on('keydown keypress keyup', $.shell.handle_interaction),
      $.shell /-$.merge/ wcapture [

# State modeling

The shell is always in an edit state. History searching and autocompletion are implemented as functions over states, but you cannot set the editor to be in the "reverse-searching history" state, for
instance.

      compiler        = $(':all'),
      val(s)          = s ? $(this).data('caterwaul-shell-state', s).modus('val', s.text_).caret(s.selection_range_) : $(this).data('caterwaul-shell-state') /or.{} /!construct_state,
      state(settings) = new state_ctor(settings.history_         || [],                 settings.values_  || [],     settings.text_     || '',
                                       settings.selection_range_ || {start: 0, end: 0}, settings.context_ || window, settings.compiler_ || compiler),

      state_ctor      = given [history, values, results, text, selection_range, context, compiler]
                              [this.history_         = history,         this.values_  = values,  this.text_     = text,
                               this.selection_range_ = selection_range, this.context_ = context, this.compiler_ = compiler, null] -se- it.prototype /-$.merge/

                        capture [is_valid() = this.compiler_.parse(this.text_) -then- true -rescue- false,
                                 modify(o)  = {} / this /-$.merge/ o /!state,
                                 accept(c)  = this /~modify/ {text_: this.text_ + String.fromCharCode(c), selection_range_: {start: this.selection_range_.start + 1, end: this.selection_range_.start + 1}},
                                 evaluate() = {values_:  this.values_  /~concat/ [{value: this.compiler_(this.text_, this.context_)} -rescue- {error: e}],
                                               history_: this.history_ /~concat/ [this.text_], context_: this.context_, compiler_: this.compiler_} /!state],

# Interaction

All interaction is triggered by keypress and keyup events on the input element. The element supports the obvious <enter> to execute a command, up/down to navigate through history, etc, but also supports
things like <tab> for autocompletion and Ctrl+R for history searching. Ctrl+W deletes a word backwards, Ctrl+U nukes from the cursor to the beginning of the line. This interaction is modeled in terms of
immutable state objects that can be retrieved and set by using the val() method.

      handle_interaction(e, self = jQuery(this)) = interact.call(self, self.val(), e) /!self.val,
      interact(s, e)                             = e.type === 'keypress' ? e.which === 13 ? s.evaluate() : s.accept(e.which) : s]});