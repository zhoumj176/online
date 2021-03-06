/* global describe it cy beforeEach require expect afterEach*/

var helper = require('../../common/helper');
var mobileHelper = require('../../common/mobile_helper');

describe('Impress insertion wizard.', function() {
	beforeEach(function() {
		mobileHelper.beforeAllMobile('insertion_wizard.odp', 'impress');

		mobileHelper.enableEditingMobile();

		mobileHelper.openInsertionWizard();
	});

	afterEach(function() {
		helper.afterAll('insertion_wizard.odp');
	});

	function selectTextOfShape() {
		// Double click onto the selected shape
		cy.get('svg g .leaflet-interactive')
			.then(function(items) {
				expect(items).to.have.length(1);
				var XPos = (items[0].getBoundingClientRect().left + items[0].getBoundingClientRect().right) / 2;
				var YPos = (items[0].getBoundingClientRect().top + items[0].getBoundingClientRect().bottom) / 2;
				cy.get('body')
					.dblclick(XPos, YPos);
			});

		cy.get('.leaflet-cursor.blinking-cursor')
			.should('exist');

		helper.selectAllText(false);
	}

	function selectionShouldBeTextShape() {
		// Check that the shape is there
		cy.get('.leaflet-pane.leaflet-overlay-pane svg')
			.should(function(svg) {
				expect(svg[0].getBBox().width).to.be.greaterThan(0);
				expect(svg[0].getBBox().height).to.be.greaterThan(0);
			});

		cy.get('.leaflet-pane.leaflet-overlay-pane g.Page g')
			.should('have.class', 'com.sun.star.drawing.TextShape');

		// Check also that the shape is fully visible
		// TODO: shapes are hungs out of the slide after insertion
		/*cy.get('svg g .leaflet-interactive')
			.should(function(items) {
				expect(items.offset().top).to.be.greaterThan(0);
				expect(items.offset().left).to.be.greaterThan(0);
			});*/
	}

	it('Check existence of image insertion items.', function() {
		cy.contains('.menu-entry-with-icon', 'Local Image...')
			.should('be.visible');

		cy.contains('.menu-entry-with-icon', 'Image...')
			.should('be.visible');
	});

	it('Insert comment.', function() {
		cy.contains('.menu-entry-with-icon', 'Comment')
			.click();

		// Comment insertion dialog is opened
		cy.get('.loleaflet-annotation-table')
			.should('exist');

		// Add some comment
		cy.get('.loleaflet-annotation-textarea')
			.type('some text');

		cy.get('.vex-dialog-button-primary')
			.click();

		cy.get('.loleaflet-annotation')
			.should('exist');

		cy.get('.loleaflet-annotation-content.loleaflet-dont-break')
			.should('have.text', 'some text');
	});

	it('Insert default table.', function() {
		// Open Table submenu
		cy.contains('.ui-header.level-0.mobile-wizard.ui-widget', 'Table')
			.click();

		cy.get('.mobile-wizard.ui-text')
			.should('be.visible');

		// Push insert table button
		cy.get('.inserttablecontrols button')
			.should('be.visible')
			.click();

		// We have two columns
		cy.get('.table-column-resize-marker')
			.should('have.length', 2);

		// and two rows
		cy.get('.table-row-resize-marker')
			.should('have.length', 2);
	});

	it('Insert custom table.', function() {
		// Open Table submenu
		cy.contains('.ui-header.level-0.mobile-wizard.ui-widget', 'Table')
			.click();
		cy.get('.mobile-wizard.ui-text')
			.should('be.visible');

		// Change rows and columns
		cy.get('.inserttablecontrols #rows .spinfieldcontrols .plus')
			.click();
		cy.get('.inserttablecontrols #cols .spinfieldcontrols .plus')
			.click();

		// Push insert table button
		cy.get('.inserttablecontrols button')
			.should('be.visible')
			.click();

		// Table is inserted with the markers shown
		cy.get('.leaflet-marker-icon.table-column-resize-marker')
			.should('exist');

		// We have three columns
		cy.get('.table-column-resize-marker')
			.should('have.length', 3);

		// and three rows
		cy.get('.table-row-resize-marker')
			.should('have.length',3);
	});

	it('Insert hyperlink.', function() {
		// Open hyperlink dialog
		cy.contains('.menu-entry-with-icon', 'Hyperlink...')
			.click();

		// Dialog is opened
		cy.get('.vex-content.hyperlink-dialog')
			.should('exist');

		// Type text and link
		cy.get('.vex-content.hyperlink-dialog input[name="text"]')
			.type('some text');
		cy.get('.vex-content.hyperlink-dialog input[name="link"]')
			.type('www.something.com');

		// Insert
		cy.get('.vex-content.hyperlink-dialog .vex-dialog-button-primary')
			.click();

		// TODO: we have some wierd shape here instead of a text shape with the link
		cy.get('.leaflet-pane.leaflet-overlay-pane svg g path.leaflet-interactive')
			.should('exist');
	});

	it('Insert shape.', function() {
		cy.contains('.menu-entry-with-icon', 'Shape')
			.click();

		cy.get('.col.w2ui-icon.basicshapes_rectangle').
			click();

		// Check that the shape is there
		cy.get('.leaflet-pane.leaflet-overlay-pane svg g')
			.should('exist');

		cy.get('.leaflet-pane.leaflet-overlay-pane svg')
			.should(function(svg) {
				expect(svg[0].getBBox().width).to.be.greaterThan(0);
				expect(svg[0].getBBox().height).to.be.greaterThan(0);
			});
	});

	it('Insert text box.', function() {
		cy.contains('.menu-entry-with-icon', 'Text Box')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		helper.expectTextForClipboard('Tap to edit text');
	});

	it('Insert date field (fixed).', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Date (fixed)')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		// Check that we have a date in MM/DD/YY format
		var regex = /\d{1,2}[/]\d{1,2}[/]\d{1,2}/;
		cy.get('#copy-paste-container pre')
			.invoke('text')
			.should('match', regex);
	});

	it('Insert date field (variable).', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Date (variable)')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		// Check that we have a date in MM/DD/YY format
		var regex = /\d{1,2}[/]\d{1,2}[/]\d{1,2}/;
		cy.get('#copy-paste-container pre')
			.invoke('text')
			.should('match', regex);
	});

	it('Insert time field (fixed).', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Time (fixed)')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		// Check that we have a time in HH/MM/SS format
		var regex = /\d{1,2}[:]\d{1,2}[:]\d{1,2}/;
		cy.get('#copy-paste-container pre')
			.invoke('text')
			.should('match', regex);
	});

	it('Insert time field (variable).', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Time (variable)')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		// Check that we have a time in HH/MM/SS format
		var regex = /\d{1,2}[:]\d{1,2}[:]\d{1,2}/;
		cy.get('#copy-paste-container pre')
			.invoke('text')
			.should('match', regex);
	});

	it('Insert slide number.', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Slide Number')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		helper.expectTextForClipboard('1');
	});

	it('Insert slide title.', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Slide Title')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		helper.expectTextForClipboard('Slide 1');
	});

	it('Insert slide count.', function() {
		cy.contains('.menu-entry-with-icon', 'More Fields...')
			.click();

		cy.contains('.menu-entry-with-icon', 'Slide Count')
			.click();

		// Check that the shape is there
		selectionShouldBeTextShape();

		// Check the text
		selectTextOfShape();

		helper.expectTextForClipboard('1');
	});
});
