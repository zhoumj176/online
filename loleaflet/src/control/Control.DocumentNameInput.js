/* -*- js-indent-level: 8 -*- */
/*
 * L.Control.DocumentNameInput
 */

/* global $ */
L.Control.DocumentNameInput = L.Control.extend({

	onAdd: function (map) {
		this.map = map;

		map.on('doclayerinit', this.onDocLayerInit, this);
		map.on('wopiprops', this.onWopiProps, this);
	},

	documentNameConfirm: function() {
		var value = $('#document-name-input').val();
		if (value !== null && value != '' && value != this.map['wopi'].BaseFileName) {
			if (this.map['wopi'].UserCanRename && this.map['wopi'].SupportsRename) {
				if (value.lastIndexOf('.') > 0) {
					var fname = this.map['wopi'].BaseFileName;
					var ext = fname.substr(fname.lastIndexOf('.')+1, fname.length);
					// check format conversion
					if (ext != value.substr(value.lastIndexOf('.')+1, value.length)) {
						this.map.saveAs(value);
					} else {
						// same extension, just rename the file
						// file name must be without the extension for rename
						value = value.substr(0, value.lastIndexOf('.'));
						this.map.sendUnoCommand('.uno:Save');
						this.map._RenameFile = value;
					}
				}
			} else {
				// saveAs for rename
				this.map.saveAs(value);
			}
		}
		this.map._onGotFocus();
	},

	documentNameCancel: function() {
		$('#document-name-input').val(this.map['wopi'].BaseFileName);
		this.map._onGotFocus();
	},

	onDocumentNameKeyPress: function(e) {
		$('#document-name-input').css('width',(($('#document-name-input').val().length + 1) * 10) + 'px');
		if (e.keyCode === 13) { // Enter key
			this.documentNameConfirm();
		} else if (e.keyCode === 27) { // Escape key
			this.documentNameCancel();
		}
	},

	onDocumentNameFocus: function() {
		// hide the caret in the main document
		this.map._onLostFocus();
	},

	onDocLayerInit: function() {
		// FIXME: Android app would display a temporary filename, not the actual filename
		if (window.ThisIsTheAndroidApp) {
			$('#document-name-input').hide();
		} else {
			$('#document-name-input').show();
		}

		if (window.ThisIsAMobileApp) {
			// We can now set the document name in the menu bar
			$('#document-name-input').prop('disabled', false);
			$('#document-name-input').removeClass('editable');
			$('#document-name-input').focus(function() { $(this).blur(); });
			// Call decodecodeURIComponent twice: Reverse both our encoding and the encoding of
			// the name in the file system.
			$('#document-name-input').val(decodeURIComponent(decodeURIComponent(this.map.options.doc.replace(/.*\//, '')))
							  // To conveniently see the initial visualViewport scale and size, un-comment the following line.
							  // + ' (' + window.visualViewport.scale + '*' + window.visualViewport.width + 'x' + window.visualViewport.height + ')'
							  // TODO: Yes, it would be better to see it change as you rotate the device or invoke Split View.
							 );
		}
	},

	onWopiProps: function(e) {
		if (e.BaseFileName !== null) {
			// set the document name into the name field
			$('#document-name-input').val(e.BaseFileName);
		}

		if (e.UserCanNotWriteRelative === false) {
			// Save As allowed
			$('#document-name-input').prop('disabled', false);
			$('#document-name-input').addClass('editable');
			$('#document-name-input').off('keypress', this.onDocumentNameKeyPress).on('keypress', this.onDocumentNameKeyPress.bind(this));
			$('#document-name-input').off('focus', this.onDocumentNameFocus).on('focus', this.onDocumentNameFocus.bind(this));
			$('#document-name-input').off('blur', this.documentNameCancel).on('blur', this.documentNameCancel.bind(this));
		} else {
			$('#document-name-input').prop('disabled', true);
			$('#document-name-input').removeClass('editable');
			$('#document-name-input').off('keypress', this.onDocumentNameKeyPress);
		}
	}
});

L.control.documentNameInput = function () {
	return new L.Control.DocumentNameInput();
};
