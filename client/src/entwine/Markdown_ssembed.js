
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { loadComponent } from 'lib/Injector';
import InsertEmbedModal from '../components/InsertEmbedModal/InsertEmbedModal';
const InjectableInsertEmbedModal = loadComponent(InsertEmbedModal);

jQuery.entwine('ss', ($) => {

    $('#insert-md-embed-react__dialog-wrapper').entwine({

        Element: null,

        Data: {},

        onunmatch() {
            // solves errors given by ReactDOM "no matched root found" error.
            this._clearModal();
        },

        _clearModal() {
            ReactDOM.unmountComponentAtNode(this[0]);
        },

        open() {
            this._renderModal(true);
        },

        close() {
            this.setData({});
            this._renderModal(false);
        },

        /**
         * Renders the react modal component
         *
         * @param {boolean} show
         * @private
         */
        _renderModal(isOpen) {
            if(!InjectableInsertEmbedModal) {
                throw new Error('Embed is not supported, Install silverstripe/asset-admin');
            }
            const handleHide = () => this.close();
            const handleInsert = (...args) => this._handleInsert(...args);
            const handleCreate = (...args) => this._handleCreate(...args);
            const handleLoadingError = (...args) => this._handleLoadingError(...args);
            const store = window.ss.store;
            const client = window.ss.apolloClient;
            const attrs = this.getOriginalAttributes();

            // create/update the react component
            console.log(attrs, "ATT")
            console.log(window.ss)
            ReactDOM.render(
            <ApolloProvider store={store} client={client}>
                <InjectableInsertEmbedModal
                    isOpen={isOpen}
                    onCreate={handleCreate}
                    onInsert={handleInsert}
                    onClosed={handleHide}
                    onLoadingError={handleLoadingError}
                    fileAttributes={attrs}
                    bodyClassName="modal__dialog modal__dialog--scrollable"
                    className="insert-embed-react__dialog-wrapper"
                />
                </ApolloProvider>,
                this[0]
        );
        },

        _handleLoadingError() {
            this.setData({});
            this.open();
        },

        /**
         * Handles inserting the selected file in the modal
         *
         * @param {object} data
         * @returns {Promise}
         * @private
         */
        _handleInsert(data) {
            const oldData = this.getData();
            this.setData(Object.assign({ Url: oldData.Url }, data));
            this.insertRemote();
            this.close();
        },

        _handleCreate(data) {
            this.setData(Object.assign({}, this.getData(), data));
            this.open();
        },

        /**
         * Find the selected node and get attributes associated to attach the data to the form
         *
         * @returns {object}
         */
        getOriginalAttributes() {
            const data = this.getData();
            return data;
        },

        /**
         * Calculate placement from css class
         */
        findPosition(cssClass) {
            const alignments = [
                'leftAlone',
                'center',
                'rightAlone',
                'left',
                'right',
            ];
            if (typeof cssClass !== 'string') {
                return '';
            }
            const classes = cssClass.split(' ');
            return alignments.find((alignment) => (
                classes.indexOf(alignment) > -1
            ));
        },

        insertRemote() {
            const $field = this.getElement();
            if (!$field) {
                return false;
            }

            const data = this.getData();

            var shortcode = '[![' + data.Url + '](' + data.PreviewUrl + ')](' + data.Url + ' "' + data.Url + '")';
            
            let pos = $field.codemirror.getCursor();
            $field.codemirror.setSelection(pos, pos);
            $field.codemirror.replaceSelection("\n" + shortcode + "\n");
            this.updateTextarea();
            return true;
        },


        updateTextarea()
        {
            const $field = this.getElement();
            $($field.element).closest('.js-markdown-holder')
                .find('textarea.markdowneditor').val($field.value());
        }

    });

});




