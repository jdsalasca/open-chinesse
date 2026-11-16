import { pinyinTokens } from '../lib/tone';
import { withKeys } from '../lib/keys';

type Props = {
  pinyin: string;
  className?: string;
  showToneNumber?: boolean;
};

export function Pinyin({ pinyin, className = '', showToneNumber = false }: Props) {
  return (
    <span className={`pinyin ${className}`.trim()} lang="zh-Latn-pinyin">
      {withKeys(pinyinTokens(pinyin), (token) => token.text).map(({ item: token, key }) => (
        <span key={key} className={`pinyin__token tone-${token.tone}`}>
          {token.text}
          {showToneNumber && token.tone < 5 && <sup className="pinyin__tone">{token.tone}</sup>}
        </span>
      ))}
    </span>
  );
}
