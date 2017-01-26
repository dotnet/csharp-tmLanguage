/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());
    describe("Tuples", () => {
        it("Deconstruct into new tuple", () => {
            const input = Input.InMethod(`(int x, int y) = point;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into existing variables", () => {
            const input = Input.InMethod(`(x, y) = point;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new tuple with var", () => {
            const input = Input.InMethod(`var (x, y) = point;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Assign to tuple variable", () => {
            const input = Input.InMethod(`(int x, int y) p = point;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifiers.LocalName("p"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new tuple in foreach", () => {
            const input = Input.InMethod(`foreach ((int x, int y) in GetPoints() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.In,
                Token.Identifiers.MethodName("GetPoints"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct into new tuple with var in foreach", () => {
            const input = Input.InMethod(`foreach (var (x, y) in GetPoints() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.In,
                Token.Identifiers.MethodName("GetPoints"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
