/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, NamespaceStyle } from './utils/tokenize';

describe("Primary Constructor Base Arguments", () => {
    before(() => { should(); });

    for (const namespaceStyle of [NamespaceStyle.BlockScoped, NamespaceStyle.FileScoped]) {
        const styleName = namespaceStyle == NamespaceStyle.BlockScoped
            ? "Block-Scoped"
            : "File-Scoped";

        it(`class: primary constructor with base class simple argument (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`class Derived(string name) : Base(name) { }`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Derived"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Base"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it(`class: primary constructor with base class lambda argument (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`class Bar(Action action) : Base(() => {}) { }`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Bar"),
                Token.Punctuation.OpenParen,
                Token.Type("Action"),
                Token.Identifier.ParameterName("action"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Base"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it(`class: primary constructor with base class multiple arguments (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`class Child(int x, string y) : Parent(x, y) { }`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Child"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Parent"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it(`class: primary constructor with base class and interface (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`class Derived(string name) : Base(name), IInterface { }`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Derived"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Base"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Comma,
                Token.Type("IInterface"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it(`record: primary constructor with base class simple argument (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`record Derived(string name) : Base(name);`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Record,
                Token.Identifier.ClassName("Derived"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Base"),
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("name"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it(`record: primary constructor with base class lambda argument (${styleName} Namespace)`, async () => {

            const input = Input.InNamespace(`record Bar(Action action) : Base(() => {});`, namespaceStyle);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Record,
                Token.Identifier.ClassName("Bar"),
                Token.Punctuation.OpenParen,
                Token.Type("Action"),
                Token.Identifier.ParameterName("action"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Colon,
                Token.Type("Base"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });
    }
});
