/* global describe it cy beforeEach require afterEach*/

var helper = require('../../common/helper');
var mobileHelper = require('../../common/mobile_helper');
var writerHelper = require('./writer_helper');

describe('Insert fields via insertion wizard.', function() {
	beforeEach(function() {
		mobileHelper.beforeAllMobile('insert_field.odt', 'writer');

		// Click on edit button
		mobileHelper.enableEditingMobile();

		mobileHelper.openInsertionWizard();

		// Open fields submenu
		cy.contains('.menu-entry-with-icon.flex-fullwidth', 'More Fields...')
			.click();

		cy.get('.ui-content.level-0.mobile-wizard')
			.should('be.visible');
	});

	afterEach(function() {
		helper.afterAll('insert_field.odt');
	});

	it('Insert page number field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Page Number')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'PAGE')
			.should('have.text', '1');
	});

	it('Insert page count field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Page Count')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DOCSTAT')
			.should('have.text', '1');
	});

	it('Insert date field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Date')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DATETIME')
			.should('have.attr', 'sdnum', '1033;1033;MM/DD/YY');
	});

	it('Insert time field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Time')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DATETIME')
			.should('have.attr', 'sdnum', '1033;1033;HH:MM:SS AM/PM');
	});

	it('Insert title field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Title')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DOCINFO')
			.should('have.attr', 'subtype', 'TITLE');
	});

	it('Insert author field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'First Author')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DOCINFO')
			.should('have.attr', 'subtype', 'CREATE')
			.should('have.attr', 'format', 'AUTHOR');
	});

	it('Insert subject field.', function() {
		// Insert field
		cy.contains('.menu-entry-with-icon', 'Subject')
			.click();

		writerHelper.selectAllMobile();

		cy.get('#copy-paste-container p span sdfield')
			.should('have.attr', 'type', 'DOCINFO')
			.should('have.attr', 'subtype', 'THEME');
	});
});
