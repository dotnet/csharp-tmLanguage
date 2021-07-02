/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Tuples", () => {
    before(() => { should(); });
    describe("Tuples", () => {
        it("Tuple literal", async () => {
            const input = Input.InMethod(`var p = (42, "hello");`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Identifiers.LocalName("p"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literals.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Assign to tuple variable", async () => {
            const input = Input.InMethod(`(int x, int y) p = point;`);
            const tokens = await tokenize(input);

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

        it("Deconstruct tuple into new locals", async () => {
            const input = Input.InMethod(`(int x, int y) = (19, 23);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct tuple into new local and discard", async () => {
            const input = Input.InMethod(`(int x, _) = (19, 23);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Variables.ReadWrite("_"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new locals", async () => {
            const input = Input.InMethod(`(int x, int y) = point;`);
            const tokens = await tokenize(input);

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

        it("Deconstruct into existing variables", async () => {
            const input = Input.InMethod(`(x, y) = point;`);
            const tokens = await tokenize(input);

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

        it("Deconstruct into new locals with single var", async () => {
            const input = Input.InMethod(`var (x, y) = point;`);
            const tokens = await tokenize(input);

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

        it("Deconstruct into new locals with multiple vars", async () => {
            const input = Input.InMethod(`(var x, var y) = point;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new locals with mixed type names and var", async () => {
            const input = Input.InMethod(`(string x, byte y, var z) = (null, 1, 2);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Byte,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Null,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("2"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct nested tuple into new locals", async () => {
            const input = Input.InMethod(`(int x, (int y, int z)) = (17, (2, 23));`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct nested tuple into new locals with multiple vars", async () => {
            const input = Input.InMethod(`(var x, (var y, var z)) = (17, (2, 23));`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct nested tuple into new locals with var", async () => {
            const input = Input.InMethod(`var (x, (y, z)) = (17, (2, 23));`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Var,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literals.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new tuple in foreach", async () => {
            const input = Input.InMethod(`foreach ((int x, int y) in GetPoints() { }`);
            const tokens = await tokenize(input);

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

        it("Deconstruct into new tuple with var in foreach", async () => {
            const input = Input.InMethod(`foreach (var (x, y) in GetPoints() { }`);
            const tokens = await tokenize(input);

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

        it("Deconstruct into new nested tuple in foreach", async () => {
            const input = Input.InMethod(`foreach ((int x, (int y, int z)) in data) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.In,
                Token.Variables.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct into new nested tuple with multiple vars in foreach", async () => {
            const input = Input.InMethod(`foreach ((var x, (var y, var z)) in data) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keywords.Var,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.In,
                Token.Variables.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct into new nested tuple with with var in foreach", async () => {
            const input = Input.InMethod(`foreach (var (x, (y, z)) in data) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Control.ForEach,
                Token.Punctuation.OpenParen,
                Token.Keywords.Var,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Identifiers.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Identifiers.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keywords.Control.In,
                Token.Variables.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});
