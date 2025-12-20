/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Locals", () => {
    before(() => { should(); });

    describe("Local variables", () => {
        it("declaration", async () => {
            const input = Input.InMethod(`int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("declaration with initializer", async () => {
            const input = Input.InMethod(`int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators", async () => {
            const input = Input.InMethod(`nint x, y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Nint,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Comma,
                Token.Identifier.LocalName("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators with initializers", async () => {
            const input = Input.InMethod(`int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifier.LocalName("y"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const declaration", async () => {
            const input = Input.InMethod(`const int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Const,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const with multiple declarators", async () => {
            const input = Input.InMethod(`const int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Const,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifier.LocalName("y"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("scoped local", async () => {
            const input = Input.InMethod(`scoped Span<int> x = stackalloc int[42];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Scoped,
                Token.Type("Span"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.StackAlloc,
                Token.PrimitiveType.Int,
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("scoped local var", async () => {
            const input = Input.InMethod(`scoped var x = y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Scoped,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("scoped ref local", async () => {
            const input = Input.InMethod(`scoped ref Span<int> x = stackalloc int[42];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Scoped,
                Token.Keyword.Modifier.Ref,
                Token.Type("Span"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.StackAlloc,
                Token.PrimitiveType.Int,
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("scoped ref local var", async () => {
            const input = Input.InMethod(`scoped ref var x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Scoped,
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref scoped local", async () => {
            const input = Input.InMethod(`ref scoped Span<int> x = stackalloc int[42];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.Scoped,
                Token.Type("Span"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.StackAlloc,
                Token.PrimitiveType.Int,
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref scoped local var", async () => {
            const input = Input.InMethod(`ref scoped var x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.Scoped,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local", async () => {
            const input = Input.InMethod(`ref int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local", async () => {
            const input = Input.InMethod(`ref readonly int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local with initializer", async () => {
            const input = Input.InMethod(`ref int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local with initializer", async () => {
            const input = Input.InMethod(`ref readonly int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local var with initializer", async () => {
            const input = Input.InMethod(`ref readonly var x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Keyword.Modifier.Ref,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });
    });

    describe("Local functions", () => {
        it("local function declaration with arrow body", async () => {
            const input = Input.InMethod(`nuint Add(nuint x, uint y) => x + y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Nuint,
                Token.Identifier.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Nuint,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.UInt,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operator.Arrow,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("local function declaration with block definition", async () => {
            const input = Input.InMethod(`
int Add(int x, int y)
{
    return x + y;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifier.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keyword.Flow.Return,
                Token.Variable.ReadWrite("x"),
                Token.Operator.Arithmetic.Addition,
                Token.Variable.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with async modifier", async () => {
            const input = Input.InMethod(`async void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Async,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with unsafe modifier", async () => {
            const input = Input.InMethod(`unsafe void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Unsafe,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with static modifier", async () => {
            const input = Input.InMethod(`static void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with extern modifier", async () => {
            const input = Input.InMethod(`extern static void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Extern,
                Token.Keyword.Modifier.Static,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});