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
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("p"),
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literal.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Named Tuple literal", async () => {
            const input = Input.InMethod(`var p = (Number: 42, Greeting: "hello");`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("p"),
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("Number"),
                Token.Punctuation.Colon,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Identifier.TupleElementName("Greeting"),
                Token.Punctuation.Colon,
                Token.Punctuation.String.Begin,
                Token.Literal.String("hello"),
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
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Identifier.LocalName("p"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct tuple into new locals", async () => {
            const input = Input.InMethod(`(int x, int y) = (19, 23);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("23"),
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
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("_"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("23"),
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
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into existing variables", async () => {
            const input = Input.InMethod(`(x, y) = point;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Variable.ReadWrite("x"),
                Token.Punctuation.Comma,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new locals with single var", async () => {
            const input = Input.InMethod(`var (x, y) = point;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new locals with multiple vars", async () => {
            const input = Input.InMethod(`(var x, var y) = point;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("point"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new locals with mixed type names and var", async () => {
            const input = Input.InMethod(`(string x, byte y, var z) = (null, 1, 2);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Byte,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Null,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("2"),
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
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("23"),
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
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct nested tuple into new locals with var", async () => {
            const input = Input.InMethod(`var (x, (y, z)) = (17, (2, 23));`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Var,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("17"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("23"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct into new tuple in foreach", async () => {
            const input = Input.InMethod(`foreach ((int x, int y) in GetPoints() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Loop.In,
                Token.Identifier.MethodName("GetPoints"),
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
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.CloseParen,
                Token.Keyword.Loop.In,
                Token.Identifier.MethodName("GetPoints"),
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
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keyword.Loop.In,
                Token.Variable.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct into new nested tuple with multiple vars in foreach", async () => {
            const input = Input.InMethod(`foreach ((var x, (var y, var z)) in data) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keyword.Loop.In,
                Token.Variable.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct into new nested tuple with with var in foreach", async () => {
            const input = Input.InMethod(`foreach (var (x, (y, z)) in data) { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Loop.ForEach,
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("x"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.Identifier.TupleElementName("y"),
                Token.Punctuation.Comma,
                Token.Identifier.TupleElementName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Keyword.Loop.In,
                Token.Variable.ReadWrite("data"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("Deconstruct with mixed type and var (int _, var _)", async () => {
            const input = Input.InMethod(`(int _, var _) = (1, 2);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct with all vars and discards (var _, var _, var _)", async () => {
            const input = Input.InMethod(`(var _, var _, var _) = ('a', 'b', 'c');`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("a"),
                Token.Punctuation.Char.End,
                Token.Punctuation.Comma,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("b"),
                Token.Punctuation.Char.End,
                Token.Punctuation.Comma,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("c"),
                Token.Punctuation.Char.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct with mixed type and var at top level (int _, var _)", async () => {
            const input = Input.FromText(`(int _, var _) = (1, 2);`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("2"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("Deconstruct with all vars and discards at top level (var _, var _, var _)", async () => {
            const input = Input.FromText(`(var _, var _, var _) = ('a', 'b', 'c');`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.Comma,
                Token.Keyword.Definition.Var,
                Token.Identifier.TupleElementName("_"),
                Token.Punctuation.CloseParen,
                Token.Operator.Assignment,
                Token.Punctuation.OpenParen,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("a"),
                Token.Punctuation.Char.End,
                Token.Punctuation.Comma,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("b"),
                Token.Punctuation.Char.End,
                Token.Punctuation.Comma,
                Token.Punctuation.Char.Begin,
                Token.Literal.Char("c"),
                Token.Punctuation.Char.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });
    });
});
