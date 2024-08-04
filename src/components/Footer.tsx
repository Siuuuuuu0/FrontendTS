import { SocialIcon } from 'react-social-icons'
import { MdLocalPhone } from 'react-icons/md'
import { IoMailOutline } from "react-icons/io5"

const Footer: React.FC = () => {

  return (


    <div className="footer-container">
      <div className='phones-container'>
        <MdLocalPhone className='phone-icon'/>
        <div className='phones'>
          <div className='phone-number'>+33 (6) 95-73-88-55</div>
          <div className='phone-number'>+7 (916) 406-94-09</div>
        </div>
      </div>
      <div className="icons-container">
        <SocialIcon
          className="social-icon"
          url="https://www.instagram.com/vadkotk/"
          style={{ height: '70%' }}
        />
        <SocialIcon
          className="social-icon"
          url="https://t.me/Vk6789012"
          style={{ height: '70%' }}
        />
        <SocialIcon
          className="social-icon"
          url="https://vk.com/id444291728"
          style={{ height: '70%' }}
        />
        <SocialIcon
          className="social-icon"
          url="https://github.com/Siuuuuuu0"
          style={{ height: '70%' }}
        />
        <SocialIcon
          className="social-icon"
          url="https://wa.me/33695738855"
          style={{ height: '70%' }}
        />
        <SocialIcon
          className="social-icon"
          url="https://discord.com/users/wontsay."
          style={{ height: '70%' }}
        />
      </div>
      <div className='email-container'>
        <IoMailOutline className='email-icon'/>
        <span className='email-text'>
          vadimkotkin1855@gmail.com
        </span>
      </div>
    </div>
  );
};

export default Footer;