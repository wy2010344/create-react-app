import type { FC } from 'react';

interface FooterProps { }

const Footer: FC<FooterProps> = () => {
  return (<div className="p-6 text-center">
    <p className="text-sm opacity-[0.7]">
      &#169; 2022 Mononymperson. All Right Reserved.
    </p>
  </div>);
}

export default Footer;
