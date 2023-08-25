/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Literals", () => {
    before(() => { should(); });

    describe("Literals", () => {
        describe("Booleans", () => {
            it("true", async () => {
                const input = Input.InClass(`bool x = true;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Bool,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.Semicolon]);
            });

            it("false", async () => {
                const input = Input.InClass(`bool x = false;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Bool,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Boolean.False,
                    Token.Punctuation.Semicolon]);
            });
        });

        describe("Chars", () => {
            it("empty", async () => {
                const input = Input.InMethod(`var x = '';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("letter", async () => {
                const input = Input.InMethod(`var x = 'a';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.Char("a"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped single quote", async () => {
                const input = Input.InMethod(`var x = '\\'';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\'"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\t", async () => {
                const input = Input.InClass(`char x = '\\t';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\t"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\n", async () => {
                const input = Input.InClass(`char x = '\\n';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\n"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1f2d", async () => {
                const input = Input.InClass(`char x = '\\x1f2d';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\x1f2d"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1", async () => {
                const input = Input.InClass(`char x = '\\x1';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\x1"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\ude12", async () => {
                const input = Input.InClass(`char x = '\\ude12';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literal.CharacterEscape("\\ude12"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });
        });

        describe("Numbers", () => {
            it("decimal zero", async () => {
                const input = Input.InClass(`int x = 0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("hexadecimal zero", async () => {
                const input = Input.InClass(`int x = 0x0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
                    Token.Literal.Numeric.Hexadecimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("binary zero", async () => {
                const input = Input.InClass(`int x = 0b0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Binary("0b"),
                    Token.Literal.Numeric.Binary("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("floating-point zero", async () => {
                const input = Input.InClass(`float x = 0.0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Float,
                    Token.Identifier.FieldName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("ommiting integral part in a decimal number", async () => {
                const input = Input.InMethod(`var x = .0f;`);
                const tokens = await tokenize(input);
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("float suffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0f;
                    var y = 0F;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("F"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("double suffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0d;
                    var y = 0D;
                `);
                
                const tokens = await tokenize(input);
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("d"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("D"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("decimal suffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0m;
                    var y = 0M;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("m"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("M"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("unsigned int suffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0u;
                    var y = 0U;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("u"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("U"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("unsigned long suffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0ul;
                    var y = 0UL;
                    var z = 0uL;
                    var w = 0Ul;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("ul"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("UL"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("z"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("uL"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("w"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("0"),
                    Token.Literal.Numeric.Other.Suffix("Ul"),
                    Token.Punctuation.Semicolon
                
                ]);
            });

            it("hexadecimal preffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0xFFFF;
                    var y = 0XFFFF;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
                    Token.Literal.Numeric.Hexadecimal("FFFF"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Hexadecimal("0X"),
                    Token.Literal.Numeric.Hexadecimal("FFFF"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("binary preffixes", async () => {
                const input = Input.InMethod(`
                    var x = 0b0101;
                    var y = 0B0101;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Binary("0b"),
                    Token.Literal.Numeric.Binary("0101"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Binary("0B"),
                    Token.Literal.Numeric.Binary("0101"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("exponent", async () => {
                const input = Input.InMethod(`
                    var x = 1.5e-3f;
                    var y = .5E+3f;
                    var z = .5e3;
                    var w = 5E3;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("5"),
                    Token.Literal.Numeric.Other.Exponent("e"),
                    Token.Operator.Arithmetic.Subtraction,
                    Token.Literal.Numeric.Decimal("3"),
                    Token.Literal.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("5"),
                    Token.Literal.Numeric.Other.Exponent("E"),
                    Token.Operator.Arithmetic.Addition,
                    Token.Literal.Numeric.Decimal("3"),
                    Token.Literal.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("z"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("5"),
                    Token.Literal.Numeric.Other.Exponent("e"),
                    Token.Literal.Numeric.Decimal("3"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("w"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("5"),
                    Token.Literal.Numeric.Other.Exponent("E"),
                    Token.Literal.Numeric.Decimal("3"),
                    Token.Punctuation.Semicolon
                
                ]);
            });

            it("decimal thousands separator", async () => {
                const input = Input.InMethod(`var x = 1_000_000;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Literal.Numeric.Other.Separator.Thousands,
                    Token.Literal.Numeric.Decimal("000"),
                    Token.Literal.Numeric.Other.Separator.Thousands,
                    Token.Literal.Numeric.Decimal("000"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("hexadecimal thousands separator", async () => {
                const input = Input.InMethod(`var x = 0xFFFF_FFFF;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Hexadecimal("0x"),
                    Token.Literal.Numeric.Hexadecimal("FFFF"),
                    Token.Literal.Numeric.Other.Separator.Thousands,
                    Token.Literal.Numeric.Hexadecimal("FFFF"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("binary thousands separator", async () => {
                const input = Input.InMethod(`var x = 0b0000_0000;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Other.Prefix.Binary("0b"),
                    Token.Literal.Numeric.Binary("0000"),
                    Token.Literal.Numeric.Other.Separator.Thousands,
                    Token.Literal.Numeric.Binary("0000"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - random typo in between", async () => {
                const input = Input.InMethod(`var pi = 3.14q57;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("pi"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("3.14q57"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("legal constant numeric followed by a method call", async () => {
                const input = Input.InMethod(`var x = 5.f();`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("5"),
                    Token.Punctuation.Accessor,
                    Token.Identifier.MethodName("f"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("legal constant numeric containing decimal point followed by a method call", async () => {
                const input = Input.InMethod(`var pi = 3.14.ToString();`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("pi"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Decimal("3"),                   
                    Token.Literal.Numeric.Other.Separator.Decimals,
                    Token.Literal.Numeric.Decimal("14"),                   
                     Token.Punctuation.Accessor,
                    Token.Identifier.MethodName("ToString"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - wrong suffix", async () => {
                const input = Input.InMethod(`var x = 100h;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("100h"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - wrong preffix", async () => {
                const input = Input.InMethod(`var x = 0kFFFF;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("0kFFFF"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - decimals in exponent", async () => {
                const input = Input.InMethod(`
                    var x = 5e3.5f;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("5e3.5f"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - integer suffixes in number with decimals", async () => {
                const input = Input.InMethod(`
                    var x = 5.0u;
                    var y = .5L;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("x"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("5.0u"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("y"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid(".5L"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - repeated suffixes (like LL for long long)", async () => {
                const input = Input.InMethod(`
                    var a = 1uu;
                    var b = 1ll;
                    var c = 1Ll;
                    var d = 1ull;
                    var e = 1ff;
                    var f = 1mm;
                    var g = 1Ff;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("a"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1uu"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("b"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1ll"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("c"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1Ll"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("d"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1ull"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("e"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1ff"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("f"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1mm"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Var,
                    Token.Identifier.LocalName("g"),
                    Token.Operator.Assignment,
                    Token.Literal.Numeric.Invalid("1Ff"),
                    Token.Punctuation.Semicolon
                ]);
            });
        });

        describe("Strings", () => {
            it("simple", async () => {
                const input = Input.InClass(`string test = "hello world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped double-quote", async () => {
                const input = Input.InClass(`string test = "hello \\"world!\\"";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello "),
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Literal.String("world!"),
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\t", async () => {
                const input = Input.InClass(`string test = "hello\\tworld!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\t"),
                    Token.Literal.String("world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\n", async () => {
                const input = Input.InClass(`string test = "hello\\nworld!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\n"),
                    Token.Literal.String("world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1f2d", async () => {
                const input = Input.InClass(`string test = "hello\\x1f2da world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\x1f2d"),
                    Token.Literal.String("a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1", async () => {
                const input = Input.InClass(`string test = "hello\\x1 a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\x1"),
                    Token.Literal.String(" a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\ude12", async () => {
                const input = Input.InClass(`string test = "hello\\ude12a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\ude12"),
                    Token.Literal.String("a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\U0001de12", async () => {
                const input = Input.InClass(`string test = "hello\\U0001de12a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hello"),
                    Token.Literal.CharacterEscape("\\U0001de12"),
                    Token.Literal.String("a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("line break before close quote", async () => {
                const input = Input.InClass(`
string test = "hello
world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("hell"),

                    // Note: Because the string ended prematurely, the rest of this line and the contents of the next are junk.
                    Token.IllegalNewLine("o"),
                    Token.Variable.ReadWrite("world"),
                    Token.Operator.Logical.Not,
                    Token.Punctuation.String.Begin,
                    Token.IllegalNewLine(";")]);
            });

            it("simple (verbatim)", async () => {
                const input = Input.InClass(`string test = @"hello world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literal.String("hello world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped double-quote (verbatim)", async () => {
                const input = Input.InClass("string test = @\"hello \"\"world!\"\"\";");
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literal.String("hello "),
                    Token.Literal.CharacterEscape("\"\""),
                    Token.Literal.String("world!"),
                    Token.Literal.CharacterEscape("\"\""),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("line break before close quote (verbatim)", async () => {
                const input = Input.InClass(`
string test = @"hello
world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifier.FieldName("test"),
                    Token.Operator.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literal.String("hello"),
                    Token.Literal.String("world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("highlight escaped double-quote properly (issue omnisharp-vscode#1078 - repro 1)", async () => {
                const input = Input.InMethod(`
configContent = rgx.Replace(configContent, $"name{suffix}\\"");
File.WriteAllText(_testConfigFile, configContent);
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Variable.ReadWrite("configContent"),
                    Token.Operator.Assignment,
                    Token.Variable.Object('rgx'),
                    Token.Punctuation.Accessor,
                    Token.Identifier.MethodName("Replace"),
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("configContent"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.InterpolatedString.Begin,
                    Token.Literal.String("name"),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Variable.ReadWrite("suffix"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variable.Object("File"),
                    Token.Punctuation.Accessor,
                    Token.Identifier.MethodName("WriteAllText"),
                    Token.Punctuation.OpenParen,
                    Token.Variable.ReadWrite("_testConfigFile"),
                    Token.Punctuation.Comma,
                    Token.Variable.ReadWrite("configContent"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("highlight escaped double-quote properly (issue omnisharp-vscode#1078 - repro 2)", async () => {
                const input = Input.InMethod(`
throw new InvalidCastException(
    $"The value \\"{this.Value} is of the type \\"{this.Type}\\". You asked for \\"{typeof(T)}\\".");
`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Flow.Throw,
                    Token.Operator.Expression.New,
                    Token.Type("InvalidCastException"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.InterpolatedString.Begin,
                    Token.Literal.String("The value "),
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Variable.This,
                    Token.Punctuation.Accessor,
                    Token.Variable.Property("Value"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literal.String(" is of the type "),
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Variable.This,
                    Token.Punctuation.Accessor,
                    Token.Variable.Property("Type"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Literal.String(". You asked for "),
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Operator.Expression.TypeOf,
                    Token.Punctuation.OpenParen,
                    Token.Type("T"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Interpolation.End,
                    Token.Literal.CharacterEscape("\\\""),
                    Token.Literal.String("."),
                    Token.Punctuation.InterpolatedString.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon
                ]);
            });

            it("highlight strings containing braces correctly (issue omnisharp-vscode#746)", async () => {
                const input = `
namespace X
{
    class Y
    {
        public MethodZ()
        {
            this.Writer.WriteLine("class CInput{0}Register : public {1}", index, baseClass);
        }
    }
}
`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Namespace,
                    Token.Identifier.NamespaceName("X"),
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Y"),
                    Token.Punctuation.OpenBrace,
                    Token.Keyword.Modifier.Public,
                    Token.Identifier.MethodName("MethodZ"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Variable.This,
                    Token.Punctuation.Accessor,
                    Token.Variable.Property("Writer"),
                    Token.Punctuation.Accessor,
                    Token.Identifier.MethodName("WriteLine"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.String.Begin,
                    Token.Literal.String("class CInput{0}Register : public {1}"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Comma,
                    Token.Variable.ReadWrite("index"),
                    Token.Punctuation.Comma,
                    Token.Variable.ReadWrite("baseClass"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });

            it("single line empty raw string literal", async () => {
                const input = Input.InMethod(`""" """`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String(" "),
                    Token.Punctuation.String.RawStringEnd(3)
                ]);
            });

            it("single line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`""" "" """`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String(' "" '),
                    Token.Punctuation.String.RawStringEnd(3)
                ]);
            });

            it("single line raw string literal trailing quotes", async () => {
                const input = Input.InMethod(`""" """""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String(' '),
                    Token.Punctuation.String.RawStringEnd(3),
                    Token.Punctuation.String.Begin,
                    Token.Punctuation.String.End
                ]);
            });

            it("quadruple single line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`"""" """ """"`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(4),
                    Token.Literal.String(' """ '),
                    Token.Punctuation.String.RawStringEnd(4)
                ]);
            });

            it("quintuple single line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`""""" """" """""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(5),
                    Token.Literal.String(' """" '),
                    Token.Punctuation.String.RawStringEnd(5)
                ]);
            });

            it("multi line empty raw string literal", async () => {
                const input = Input.InMethod(`"""

"""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String(""),
                    Token.Punctuation.String.RawStringEnd(3)
                ]);
            });

            it("multi line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`"""
""
"""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String('""'),
                    Token.Punctuation.String.RawStringEnd(3)
                ]);
            });

            it("multi line raw string literal trailing quotes", async () => {
                const input = Input.InMethod(`"""

"""""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(3),
                    Token.Literal.String(""),
                    Token.Punctuation.String.RawStringEnd(3),
                    Token.Punctuation.String.Begin,
                    Token.Punctuation.String.End
                ]);
            });

            it("quadruple multi line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`""""
"""
""""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(4),
                    Token.Literal.String('"""'),
                    Token.Punctuation.String.RawStringEnd(4)
                ]);
            });

            it("quintuple multi line inner quotes raw string literal", async () => {
                const input = Input.InMethod(`"""""
""""
"""""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.String.RawStringBegin(5),
                    Token.Literal.String('""""'),
                    Token.Punctuation.String.RawStringEnd(5)
                ]);
            });

            [1, 2].forEach(n => {
                it(`triple interpolations with ${n} dollars single line`, async () => {
                    const input = Input.InMethod('$'.repeat(n) + `""" ${'{'.repeat(n)}1 + 1${'}'.repeat(n)} """`);

                    const tokens = await tokenize(input);

                    tokens.should.deep.equal([
                        Token.Punctuation.InterpolatedString.RawStringBegin(3, n),
                        Token.Literal.String(" "),
                        Token.Punctuation.Interpolation.RawBegin(n),
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Operator.Arithmetic.Addition,
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Punctuation.Interpolation.RawEnd(n),
                        Token.Literal.String(" "),
                        Token.Punctuation.InterpolatedString.RawStringEnd(3)
                    ]);
                });

                it(`quadruple interpolations with ${n} dollars single line`, async () => {
                    const input = Input.InMethod('$'.repeat(n) + `"""" ${'{'.repeat(n)}1 + 1${'}'.repeat(n)} """"`);

                    const tokens = await tokenize(input);

                    tokens.should.deep.equal([
                        Token.Punctuation.InterpolatedString.RawStringBegin(4, n),
                        Token.Literal.String(" "),
                        Token.Punctuation.Interpolation.RawBegin(n),
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Operator.Arithmetic.Addition,
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Punctuation.Interpolation.RawEnd(n),
                        Token.Literal.String(" "),
                        Token.Punctuation.InterpolatedString.RawStringEnd(4)
                    ]);
                });

                it(`triple interpolations with ${n} dollars multi line`, async () => {
                    const input = Input.InMethod('$'.repeat(n) + `"""
${'{'.repeat(n)}1 + 1${'}'.repeat(n)}
"""`);

                    const tokens = await tokenize(input);

                    tokens.should.deep.equal([
                        Token.Punctuation.InterpolatedString.RawStringBegin(3, n),
                        Token.Punctuation.Interpolation.RawBegin(n),
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Operator.Arithmetic.Addition,
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Punctuation.Interpolation.RawEnd(n),
                        Token.Punctuation.InterpolatedString.RawStringEnd(3)
                    ]);
                });

                it(`quadruple interpolations with ${n} dollars multi line`, async () => {
                    const input = Input.InMethod('$'.repeat(n) + `""""
${'{'.repeat(n)}1 + 1${'}'.repeat(n)}
""""`);

                    const tokens = await tokenize(input);

                    tokens.should.deep.equal([
                        Token.Punctuation.InterpolatedString.RawStringBegin(4, n),
                        Token.Punctuation.Interpolation.RawBegin(n),
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Operator.Arithmetic.Addition,
                        Token.Literal.Numeric.Decimal("1"),
                        Token.Punctuation.Interpolation.RawEnd(n),
                        Token.Punctuation.InterpolatedString.RawStringEnd(4)
                    ]);
                });
            });

            it("double dollar raw string ignores { characters", async () => {
                const input = Input.InMethod(`$$""""
{1 + 1}
{{1 + 1}}
{1 + 1}
""""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.InterpolatedString.RawStringBegin(4, 2),
                    Token.Literal.String("{1 + 1}"),
                    Token.Punctuation.Interpolation.RawBegin(2),
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Operator.Arithmetic.Addition,
                    Token.Literal.Numeric.Decimal("1"),
                    Token.Punctuation.Interpolation.RawEnd(2),
                    Token.Literal.String("{1 + 1}"),
                    Token.Punctuation.InterpolatedString.RawStringEnd(4)
                ]);
            });

            it("five quotes has no interpolation holes", async () => {
                const input = Input.InMethod(`$"""""
{1 + 1}
{{1 + 1}}
{1 + 1}
"""""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.InterpolatedString.RawStringBegin(5, 1),
                    Token.Literal.String("{1 + 1}"),
                    Token.Literal.String("{{1 + 1}}"),
                    Token.Literal.String("{1 + 1}"),
                    Token.Punctuation.InterpolatedString.RawStringEnd(5)
                ]);
            });

            it("three dollars has no interpolation holes", async () => {
                const input = Input.InMethod(`$$$"""
{1 + 1}
{{1 + 1}}
{1 + 1}
"""`);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Punctuation.InterpolatedString.RawStringBegin(3, 3),
                    Token.Literal.String("{1 + 1}"),
                    Token.Literal.String("{{1 + 1}}"),
                    Token.Literal.String("{1 + 1}"),
                    Token.Punctuation.InterpolatedString.RawStringEnd(3)
                ]);
            });
        });
    });
});
