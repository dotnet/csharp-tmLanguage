/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Literals", () => {
        describe("Booleans", () => {
            it("true", async () => {
                const input = Input.InClass(`bool x = true;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Bool,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Boolean.True,
                    Token.Punctuation.Semicolon]);
            });

            it("false", async () => {
                const input = Input.InClass(`bool x = false;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Bool,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Boolean.False,
                    Token.Punctuation.Semicolon]);
            });
        });

        describe("Chars", () => {
            it("empty", async () => {
                const input = Input.InMethod(`var x = '';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("letter", async () => {
                const input = Input.InMethod(`var x = 'a';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.Char("a"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped single quote", async () => {
                const input = Input.InMethod(`var x = '\\'';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\'"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\t", async () => {
                const input = Input.InClass(`char x = '\\t';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\t"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\n", async () => {
                const input = Input.InClass(`char x = '\\n';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\n"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1f2d", async () => {
                const input = Input.InClass(`char x = '\\x1f2d';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\x1f2d"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1", async () => {
                const input = Input.InClass(`char x = '\\x1';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\x1"),
                    Token.Punctuation.Char.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\ude12", async () => {
                const input = Input.InClass(`char x = '\\ude12';`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Char,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Punctuation.Char.Begin,
                    Token.Literals.CharacterEscape("\\ude12"),
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
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("hexadecimal zero", async () => {
                const input = Input.InClass(`int x = 0x0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
                    Token.Literals.Numeric.Hexadecimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("binary zero", async () => {
                const input = Input.InClass(`int x = 0b0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Int,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Binary("0b"),
                    Token.Literals.Numeric.Binary("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("floating-point zero", async () => {
                const input = Input.InClass(`float x = 0.0;`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.Float,
                    Token.Identifiers.FieldName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Separator.Decimals,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Punctuation.Semicolon]);
            });

            it("ommiting integral part in a decimal number", async () => {
                const input = Input.InMethod(`var x = .0f;`);
                const tokens = await tokenize(input);
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Separator.Decimals,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("f"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("F"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("d"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("D"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("m"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("M"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("u"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("U"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("ul"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("UL"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("z"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("uL"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("w"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("0"),
                    Token.Literals.Numeric.Other.Suffix("Ul"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
                    Token.Literals.Numeric.Hexadecimal("FFFF"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Hexadecimal("0X"),
                    Token.Literals.Numeric.Hexadecimal("FFFF"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Binary("0b"),
                    Token.Literals.Numeric.Binary("0101"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Binary("0B"),
                    Token.Literals.Numeric.Binary("0101"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Literals.Numeric.Other.Separator.Decimals,
                    Token.Literals.Numeric.Decimal("5"),
                    Token.Literals.Numeric.Other.Exponent("e"),
                    Token.Operators.Arithmetic.Subtraction,
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Literals.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Separator.Decimals,
                    Token.Literals.Numeric.Decimal("5"),
                    Token.Literals.Numeric.Other.Exponent("E"),
                    Token.Operators.Arithmetic.Addition,
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Literals.Numeric.Other.Suffix("f"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("z"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Separator.Decimals,
                    Token.Literals.Numeric.Decimal("5"),
                    Token.Literals.Numeric.Other.Exponent("e"),
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("w"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("5"),
                    Token.Literals.Numeric.Other.Exponent("E"),
                    Token.Literals.Numeric.Decimal("3"),
                    Token.Punctuation.Semicolon
                
                ]);
            });

            it("decimal thousands separator", async () => {
                const input = Input.InMethod(`var x = 1_000_000;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Decimal("1"),
                    Token.Literals.Numeric.Other.Separator.Thousands,
                    Token.Literals.Numeric.Decimal("000"),
                    Token.Literals.Numeric.Other.Separator.Thousands,
                    Token.Literals.Numeric.Decimal("000"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("hexadecimal thousands separator", async () => {
                const input = Input.InMethod(`var x = 0xFFFF_FFFF;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Hexadecimal("0x"),
                    Token.Literals.Numeric.Hexadecimal("FFFF"),
                    Token.Literals.Numeric.Other.Separator.Thousands,
                    Token.Literals.Numeric.Hexadecimal("FFFF"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("binary thousands separator", async () => {
                const input = Input.InMethod(`var x = 0b0000_0000;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Other.Preffix.Binary("0b"),
                    Token.Literals.Numeric.Binary("0000"),
                    Token.Literals.Numeric.Other.Separator.Thousands,
                    Token.Literals.Numeric.Binary("0000"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - random typo in between", async () => {
                const input = Input.InMethod(`var pi = 3.14q57;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("pi"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("3.14q57"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - decimal point separator with no decimal part", async () => {
                const input = Input.InMethod(`var x = 5.f;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("5.f"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - wrong suffix", async () => {
                const input = Input.InMethod(`var x = 100h;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("100h"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - wrong preffix", async () => {
                const input = Input.InMethod(`var x = 0kFFFF;`);
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("0kFFFF"),
                    Token.Punctuation.Semicolon
                ]);
            });

            it("invalid illegal constant numeric - decimals in exponent", async () => {
                const input = Input.InMethod(`
                    var x = 5e3.5f;
                `);
                
                const tokens = await tokenize(input);
                
                tokens.should.deep.equal([
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("5e3.5f"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("x"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("5.0u"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("y"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid(".5L"),
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
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("a"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1uu"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("b"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1ll"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("c"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1Ll"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("d"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1ull"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("e"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1ff"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("f"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1mm"),
                    Token.Punctuation.Semicolon,
                    Token.Keywords.Var,
                    Token.Identifiers.LocalName("g"),
                    Token.Operators.Assignment,
                    Token.Literals.Numeric.Invalid("1Ff"),
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
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped double-quote", async () => {
                const input = Input.InClass(`string test = "hello \\"world!\\"";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello "),
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Literals.String("world!"),
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\t", async () => {
                const input = Input.InClass(`string test = "hello\\tworld!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\t"),
                    Token.Literals.String("world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\n", async () => {
                const input = Input.InClass(`string test = "hello\\nworld!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\n"),
                    Token.Literals.String("world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1f2d", async () => {
                const input = Input.InClass(`string test = "hello\\x1f2da world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\x1f2d"),
                    Token.Literals.String("a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\x1", async () => {
                const input = Input.InClass(`string test = "hello\\x1 a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\x1"),
                    Token.Literals.String(" a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\ude12", async () => {
                const input = Input.InClass(`string test = "hello\\ude12a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\ude12"),
                    Token.Literals.String("a world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped character escape \\U0001de12", async () => {
                const input = Input.InClass(`string test = "hello\\U0001de12a world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),
                    Token.Literals.CharacterEscape("\\U0001de12"),
                    Token.Literals.String("a world!"),
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
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("hello"),

                    // Note: Because the string ended prematurely, the rest of this line and the contents of the next are junk.
                    Token.IllegalNewLine(" "),
                    Token.Variables.ReadWrite("world"),
                    Token.Operators.Logical.Not,
                    Token.Punctuation.String.Begin,
                    Token.IllegalNewLine(";")]);
            });

            it("simple (verbatim)", async () => {
                const input = Input.InClass(`string test = @"hello world!";`);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literals.String("hello world!"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Semicolon]);
            });

            it("escaped double-quote (verbatim)", async () => {
                const input = Input.InClass("string test = @\"hello \"\"world!\"\"\";");
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.PrimitiveType.String,
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literals.String("hello "),
                    Token.Literals.CharacterEscape("\"\""),
                    Token.Literals.String("world!"),
                    Token.Literals.CharacterEscape("\"\""),
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
                    Token.Identifiers.FieldName("test"),
                    Token.Operators.Assignment,
                    Token.Punctuation.String.VerbatimBegin,
                    Token.Literals.String("hello "),
                    Token.Literals.String("world!"),
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
                    Token.Variables.ReadWrite("configContent"),
                    Token.Operators.Assignment,
                    Token.Variables.Object('rgx'),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("Replace"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("configContent"),
                    Token.Punctuation.Comma,
                    Token.Punctuation.InterpolatedString.Begin,
                    Token.Literals.String("name"),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Variables.ReadWrite("suffix"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Punctuation.String.End,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Variables.Object("File"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("WriteAllText"),
                    Token.Punctuation.OpenParen,
                    Token.Variables.ReadWrite("_testConfigFile"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("configContent"),
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
                    Token.Keywords.Control.Throw,
                    Token.Keywords.New,
                    Token.Type("InvalidCastException"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.InterpolatedString.Begin,
                    Token.Literals.String("The value "),
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Value"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literals.String(" is of the type "),
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Type"),
                    Token.Punctuation.Interpolation.End,
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Literals.String(". You asked for "),
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Punctuation.Interpolation.Begin,
                    Token.Keywords.TypeOf,
                    Token.Punctuation.OpenParen,
                    Token.Type("T"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Interpolation.End,
                    Token.Literals.CharacterEscape("\\\""),
                    Token.Literals.String("."),
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
                    Token.Keywords.Namespace,
                    Token.Identifiers.NamespaceName("X"),
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Y"),
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.Modifiers.Public,
                    Token.Identifiers.MethodName("MethodZ"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Keywords.This,
                    Token.Punctuation.Accessor,
                    Token.Variables.Property("Writer"),
                    Token.Punctuation.Accessor,
                    Token.Identifiers.MethodName("WriteLine"),
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.String.Begin,
                    Token.Literals.String("class CInput{0}Register : public {1}"),
                    Token.Punctuation.String.End,
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("index"),
                    Token.Punctuation.Comma,
                    Token.Variables.ReadWrite("baseClass"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace
                ]);
            });
        });
    });
});
