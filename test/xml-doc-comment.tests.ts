/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("XML Doc Comments", () => {
    before(() => { should(); });

    describe("XML Doc Comments", () => {
        it("start tag", async () => {
            const input = `/// <summary>`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.StartTagEnd
            ]);
        });

        it("end tag", async () => {
            const input = `/// </summary>`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.EndTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EndTagEnd
            ]);
        });

        it("empty tag", async () => {
            const input = `/// <summary />`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.EmptyTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EmptyTagEnd
            ]);
        });

        it("start tag with attribute and single-quoted string", async () => {
            const input = `/// <param name='x'>`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("param"),
                Token.XmlDocComment.Attribute.Name("name"),
                Token.XmlDocComment.Equals,
                Token.XmlDocComment.String.SingleQuoted.Begin,
                Token.XmlDocComment.String.SingleQuoted.Text("x"),
                Token.XmlDocComment.String.SingleQuoted.End,
                Token.XmlDocComment.Tag.StartTagEnd
            ]);
        });

        it("start tag with attribute and double-quoted string", async () => {
            const input = `/// <param name="x">`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("param"),
                Token.XmlDocComment.Attribute.Name("name"),
                Token.XmlDocComment.Equals,
                Token.XmlDocComment.String.DoubleQuoted.Begin,
                Token.XmlDocComment.String.DoubleQuoted.Text("x"),
                Token.XmlDocComment.String.DoubleQuoted.End,
                Token.XmlDocComment.Tag.StartTagEnd
            ]);
        });

        it("comment", async () => {
            const input = `/// <!-- comment -->`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Comment.Begin,
                Token.XmlDocComment.Comment.Text(" comment "),
                Token.XmlDocComment.Comment.End
            ]);
        });

        it("cdata", async () => {
            const input = `/// <![CDATA[c]]>`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.CData.Begin,
                Token.XmlDocComment.CData.Text("c"),
                Token.XmlDocComment.CData.End
            ]);
        });

        it("character entity - name", async () => {
            const input = `/// &amp;`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.CharacterEntity.Begin,
                Token.XmlDocComment.CharacterEntity.Text("amp"),
                Token.XmlDocComment.CharacterEntity.End
            ]);
        });

        it("character entity - decimal", async () => {
            const input = `/// &#0038;`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.CharacterEntity.Begin,
                Token.XmlDocComment.CharacterEntity.Text("#0038"),
                Token.XmlDocComment.CharacterEntity.End
            ]);
        });

        it("character entity - hdex", async () => {
            const input = `/// &#x0026;`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.CharacterEntity.Begin,
                Token.XmlDocComment.CharacterEntity.Text("#x0026"),
                Token.XmlDocComment.CharacterEntity.End
            ]);
        });

        it("XML doc comments are highlighted properly on enum members (issue omnisharp-vscode#706)", async () => {
            const input = `
/// <summary> This is a test Enum </summary>
public enum TestEnum
{
    /// <summary> Test Value One </summary>
    TestValueOne= 0,
    /// <summary> Test Value Two </summary>
    TestValueTwo = 1
}`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.StartTagEnd,
                Token.XmlDocComment.Text(" This is a test Enum "),
                Token.XmlDocComment.Tag.EndTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EndTagEnd,
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Enum,
                Token.Identifier.EnumName("TestEnum"),
                Token.Punctuation.OpenBrace,
                Token.Comment.LeadingWhitespace("    "),
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.StartTagEnd,
                Token.XmlDocComment.Text(" Test Value One "),
                Token.XmlDocComment.Tag.EndTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EndTagEnd,
                Token.Identifier.EnumMemberName("TestValueOne"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("0"),
                Token.Punctuation.Comma,
                Token.Comment.LeadingWhitespace("    "),
                Token.XmlDocComment.Begin,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.StartTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.StartTagEnd,
                Token.XmlDocComment.Text(" Test Value Two "),
                Token.XmlDocComment.Tag.EndTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EndTagEnd,
                Token.Identifier.EnumMemberName("TestValueTwo"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("1"),
                Token.Punctuation.CloseBrace
            ]);
        });

        it("multiline (issue #151)", async () => {
            const input = `
    /**
     * <summary />
     */`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Comment.LeadingWhitespace("    "),
                Token.XmlDocComment.BeginDelim,
                Token.Comment.LeadingWhitespace("     "),
                Token.XmlDocComment.Delim,
                Token.XmlDocComment.Text(" "),
                Token.XmlDocComment.Tag.EmptyTagBegin,
                Token.XmlDocComment.Tag.Name("summary"),
                Token.XmlDocComment.Tag.EmptyTagEnd,
                Token.Comment.LeadingWhitespace("     "),
                Token.XmlDocComment.End,
            ]);
        });
    });
});