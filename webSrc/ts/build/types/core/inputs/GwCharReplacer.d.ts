import { GwTypedMap, GwValueAndCursorPos } from "../../types/gwTypes";
/**
 * Static class used to replace characters stored in mapDefaultSpecialChars to their corresponding values.
 * This is primary used to replace word-processing special characters like ¾ with 3/4
 * The preference replaceWordProcessingCharacters when set to true causes gwEvents.onGlobalInputEvent to run: GwCharReplacer.replace on all input
 *
 * Mappings can be modified via GwCharReplacer.setCharacterMapping and GwCharReplacer.removeCharacterMapping
 * @link TestGwCharReplacer.spec.ts
 */
export declare abstract class GwCharReplacer {
    static needsReplacement(str: string): boolean;
    static convertFullWidthToHalfWidth(text: string): string;
    static replace(textWithCursor: GwValueAndCursorPos): GwValueAndCursorPos;
    static setCharacterMapping(singleChar: string, nLengthString: string): void;
    static removeCharacterMapping(singleChar: string): void;
    static getCharacterMappings(): GwTypedMap<string>;
    static resetCustomCharacterMappings(): void;
    /**
     * Used for testing. Returns an array of all graphemes used to construct the provided character,
     * For standard Unicode, this will be an array with a single string in the format of "\u0000".
     * For multi byte characters/glyphs/emojis, this will be an array of many single Unicode formatted strings.
     * @param char
     */
    static getUnicodeSequence(char: string): string[];
    /**
     * Used for testing. Returns a single string base16 Unicode prefixed value.
     * If the character is multi byte, then returns each grapheme joined together
     * in a single string.
     * @param char
     * @param prefix - optional replacement for javascript's "\u", for example "U+"
     * @param joiner - multi byte characters will be stringed together by " " by default
     */
    static getUnicode(char: string, prefix?: string, joiner?: string): string;
    /**
     * Converts all non standard hyphen/dashes/minus characters to the standard
     * unicode character \u002D "hyphen-minus".
     * @param str
     */
    static convertAllMinusLikesToHyphenMinus(str: string): string;
}
