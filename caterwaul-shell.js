caterwaul.module( 'shell' , function ($) { $.shell =function (context, compiler) { ; return jQuery( "<input>") .addClass( "caterwaul-shell") .modus($.shell.val, $.shell.val) .on( 'keydown keypress keyup' , $.shell.handle_interaction) .val($.shell.state( {context_: context, compiler_: compiler}))} ,$.merge( $.shell, (function () {var compiler = $( ':all') , val =function (s) {var self = jQuery(this) ; return s ? (function (it) {return it.caret(s.selection_) , it}) .call(this, ( self.data( 'caterwaul-shell-state' , s) .modus( 'val' , s.text_))):state($.merge( {} , self.data( 'caterwaul-shell-state') , {text_: self.modus( 'val') , selection_: self.caret()}))} , state =function (settings) { ; return new state_ctor(settings.history_ || [] , settings.values_ || [] , settings.text_ || '' , settings.selection_ || {start: 0, end: 0} , settings.context_ || window, settings.compiler_ || compiler)} , state_ctor = (function (it) {return $.merge( it.prototype, {is_valid:function () { ; return(function () {try {return( this.compiler_.parse(this.text_) , true)} catch (e) {return false}}) .call(this)} , modify:function (o) { ; return state($.merge( {} , this, o))} , accept:function (c) { ; return( this) .modify( {text_: ( '' + (this.text_.substr(0, this.selection_.start)) + '' + (String.fromCharCode(c)) + '' + (this.text_.substr(this.selection_.end)) + '') , selection_: {start: this.selection_.start + 1, end: this.selection_.start + 1}})} , evaluate:function () { ; return state( {values_: ( this.values_) .concat( [ (function () {try {return{value: this.compiler_(this.text_, this.context_)}} catch (e) {return {error: e}}}) .call(this)]) , history_: ( this.history_) .concat( [this.text_]) , context_: this.context_, compiler_: this.compiler_})}}) , it}) .call(this, ( (function (history, values, text, selection, context, compiler) {return this.history_ = history, this.values_ = values, this.text_ = text, this.selection_ = selection, this.context_ = context, this.compiler_ = compiler, null}))) , handle_interaction =function (e) {var self = jQuery(this) ;var old_state = self.val() ;var new_state = interact.call(self, old_state, e) ; return new_state !== old_state ? ( self.val(new_state) , false): true} , interact =function (s, e) { ; return e.type === 'keypress' ? e.which === 13 ? s.evaluate(): s.accept(e.which): s} ; return{ compiler: compiler, val: val, state: state, state_ctor: state_ctor, handle_interaction: handle_interaction, interact: interact}}) .call(this))}) ;