import { pinyinTokens } from '../lib/tone';

type Props = {
  pinyin: string;
  className?: string;
  showToneNumber?: boolean;
};

export function Pinyin({ pinyin, className = '', showToneNumber = false }: Props) {
  return (
    <span className={`pinyin ${className}`.trim()} lang="zh-Latn-pinyin">
      {pinyinTokens(pinyin).map((token, index) => (
        <span key={`${token.text}-${index}`} className={`pinyin__token tone-${token.tone}`}>
          {token.text}
          {showToneNumber && token.tone < 5 && <sup className="pinyin__tone">{token.tone}</sup>}
        </span>
      ))}
    </span>
  );
}
