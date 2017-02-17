/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Comments", () => {
        it("single-line comment", () => {
            const input = `// foo`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("single-line comment after whitespace", () => {
            const input = `    // foo`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.LeadingWhitespace("    "),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("multi-line comment", () => {
            const input = `/* foo */`;
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" foo "),
                Token.Comment.MultiLine.End]);
        });

        it("in namespace", () => {
            const input = Input.InNamespace(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in class", () => {
            const input = Input.InClass(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in enum", () => {
            const input = Input.InEnum(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in interface", () => {
            const input = Input.InInterface(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in struct", () => {
            const input = Input.InStruct(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("in method", () => {
            const input = Input.InMethod(`// foo`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" foo")]);
        });

        it("comment should colorize if there isn't a space before it (issue omnisharp-vscode#225)", () => {
            const input = Input.InClass(`
private char GetChar()//Метод возвращающий
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.PrimitiveType.Char,
                Token.Identifiers.MethodName("GetChar"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text("Метод возвращающий")]);
        });

        it("comment out class declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public class CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out class declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public class CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out interface declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public interface CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out interface declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public interface CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out struct declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public struct CustomBootstrapper // : DefaultNancyBootstrapper
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : DefaultNancyBootstrapper"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out struct declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public struct CustomBootstrapper /* : DefaultNancyBootstrapper */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Struct,
                Token.Identifiers.StructName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : DefaultNancyBootstrapper "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out enum declaration base type list - single line (issue #41)", () => {
            const input = Input.FromText(`
public enum CustomBootstrapper // : byte
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("CustomBootstrapper"),
                Token.Comment.SingleLine.Start,
                Token.Comment.SingleLine.Text(" : byte"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("comment out enum declaration base type list - multi line (issue #41)", () => {
            const input = Input.FromText(`
public enum CustomBootstrapper /* : byte */
{
}
`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("CustomBootstrapper"),
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text(" : byte "),
                Token.Comment.MultiLine.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });
    });
});