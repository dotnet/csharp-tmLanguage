/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Interpolated strings", () => {
    before(() => { should(); });

    describe("Interpolated strings", () => {
        it("two interpolations", async () => {

            const input = Input.InClass(`string test = $"hello {one} world {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" world "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("no interpolations", async () => {

            const input = Input.InClass(`string test = $"hello world!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hello world!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("no interpolations due to escaped braces", async () => {

            const input = Input.InClass(`string test = $"hello {{one}} world {{two}}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hello {{one}} world {{two}}!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("two interpolations with escaped braces", async () => {

            const input = Input.InClass(`string test = $"hello {{{one}}} world {{{two}}}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hello "),
                Token.Literal.String("{{"),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("}} world "),
                Token.Literal.String("{{"),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("}}!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("no interpolations due to double-escaped braces", async () => {

            const input = Input.InClass(`string test = $"hello {{{{one}}}} world {{{{two}}}}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hello {{{{one}}}} world {{{{two}}}}!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines (non-verbatim)", async () => {

            const input = Input.InClass(`
string test = $"hello
world!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.Begin,
                Token.Literal.String("hell"),

                // Note: Because the string ended prematurely, the rest of this line and the contents of the next are junk.
                Token.IllegalNewLine("o"),
                Token.Variable.ReadWrite("world"),
                Token.Operator.Logical.Not,
                Token.Punctuation.String.Begin,
                Token.IllegalNewLine(";")]);
        });

        it("verbatim with two interpolations", async () => {

            const input = Input.InClass(`string test = $@"hello {one} world {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBegin,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" world "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("verbatim with two interpolations (reverse)", async () => {

            const input = Input.InClass(`string test = @$"hello {one} world {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBeginReverse,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" world "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("verbatim with two interpolations and escaped double-quotes", async () => {

            const input = Input.InClass(`string test = $@"hello {one} ""world"" {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBegin,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" "),
                Token.Literal.CharacterEscape("\"\""),
                Token.Literal.String("world"),
                Token.Literal.CharacterEscape("\"\""),
                Token.Literal.String(" "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("verbatim with two interpolations and escaped double-quotes (reverse)", async () => {

            const input = Input.InClass(`string test = @$"hello {one} ""world"" {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBeginReverse,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" "),
                Token.Literal.CharacterEscape("\"\""),
                Token.Literal.String("world"),
                Token.Literal.CharacterEscape("\"\""),
                Token.Literal.String(" "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines with two interpolations (verbatim)", async () => {

            const input = Input.InClass(`
string test = $@"hello {one}
world {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBegin,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("world "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines with two interpolations (verbatim / reverse)", async () => {

            const input = Input.InClass(`
string test = @$"hello {one}
world {two}!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBeginReverse,
                Token.Literal.String("hello "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("one"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("world "),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("two"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String("!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines and start with a new line with an interpolation (verbatim)", async () => {

            const input = Input.InClass(`
string test = $@"
I am a multiline string with a
{parameter} that starts after a newline!
";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBegin,
                Token.Literal.String("I am a multiline string with a"),
                Token.Punctuation.Interpolation.Begin,
                Token.Variable.ReadWrite("parameter"),
                Token.Punctuation.Interpolation.End,
                Token.Literal.String(" that starts after a newline!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines with no interpolations (verbatim)", async () => {

            const input = Input.InClass(`
string test = $@"hello
world!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBegin,
                Token.Literal.String("hello"),
                Token.Literal.String("world!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });

        it("break across two lines with no interpolations (verbatim / reverse)", async () => {

            const input = Input.InClass(`
string test = @$"hello
world!";`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.String,
                Token.Identifier.FieldName("test"),
                Token.Operator.Assignment,
                Token.Punctuation.InterpolatedString.VerbatimBeginReverse,
                Token.Literal.String("hello"),
                Token.Literal.String("world!"),
                Token.Punctuation.InterpolatedString.End,
                Token.Punctuation.Semicolon]);
        });
    });
});