/* global describe it cy beforeEach require afterEach Cypress*/

var helper = require('../../common/helper');
var calc = require('../../common/calc');
var mobileHelper = require('../../common/mobile_helper');
var calcHelper = require('./calc_helper');

describe('Apply font changes.', function() {
	beforeEach(function() {
		mobileHelper.beforeAllMobile('apply_font.ods', 'calc');

		// Click on edit button
		mobileHelper.enableEditingMobile();

		calc.clickOnFirstCell();

		cy.get('.leaflet-marker-icon')
			.should('be.visible');

		// Open mobile wizard
		mobileHelper.openMobileWizard();

		// Open character properties
		cy.get('#TextPropertyPanel')
			.click();

		cy.get('#Bold')
			.should('be.visible');
	});

	afterEach(function() {
		helper.afterAll('apply_font.ods');
	});

	it('Apply bold.', function() {
		cy.get('#Bold')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td b')
			.should('exist');
	});

	it('Apply italic.', function() {
		cy.get('#Italic')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td i')
			.should('exist');
	});

	it('Apply underline.', function() {
		cy.get('#Underline')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td u')
			.should('exist');
	});

	it('Apply strikeout.', function() {
		cy.get('#Strikeout')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td s')
			.should('exist');
	});

	it('Apply shadowed.', function() {
		cy.get('#Shadowed')
			.click();

		calcHelper.selectAllMobile();

		// TODO: Shadowed is not in the clipboard content.
	});

	it('Apply font name.', function() {
		// Change font name
		cy.get('#fontnamecombobox')
			.click();

		cy.contains('.mobile-wizard.ui-combobox-text', 'Linux Libertine G')
			.click();

		cy.get('.level-1[title="Font Name"] .mobile-wizard.ui-combobox-text.selected')
			.should('have.text', 'Linux Libertine G');

		cy.get('#mobile-wizard-back')
			.click();

		// Combobox entry contains the selected font name
		cy.get('#fontnamecombobox .ui-header-right .entry-value')
			.should('have.text', 'Linux Libertine G');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td font')
			.should('have.attr', 'face', 'Linux Libertine G');
	});

	it('Apply font size.', function() {
		// Change font size
		cy.get('#fontsizecombobox')
			.click();

		cy.contains('.mobile-wizard.ui-combobox-text', '14')
			.click();

		if (Cypress.env('LO_CORE_VERSION') === 'master')
			cy.get('.level-1[title="Font Size"] .mobile-wizard.ui-combobox-text.selected')
				.should('have.text', '14 pt');
		else
			cy.get('.level-1[title="Font Size"] .mobile-wizard.ui-combobox-text.selected')
				.should('have.text', '14');

		cy.get('#mobile-wizard-back')
			.click();

		// Combobox entry contains the selected font name
		cy.get('#fontsizecombobox .ui-header-right .entry-value')
			.should('have.text', '14');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td font')
			.should('have.attr', 'size', '4');
	});

	it('Apply grow.', function() {
		// Push grow
		cy.get('#Grow')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td font')
			.should('have.attr', 'size', '3');
	});

	it('Apply shrink.', function() {
		// Push shrink
		cy.get('#Shrink')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td font')
			.should('have.attr', 'size', '1');
	});

	it('Apply font color.', function() {
		// Change font color
		cy.get('#Color')
			.click();

		cy.get('#color-picker-0-basic-color-5')
			.click();

		cy.get('#mobile-wizard-back')
			.click();

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td font')
			.should('have.attr', 'color', '#00FF00');
	});
});
