import style from '@/styles/client/article/reading.module.css';
import personal from '@/data/personal.json';

const ContactCard: React.FC= () => {
  return (
    <div className={style.profileCard}>
        <img className={style.avatar} src="/image/general/avatar.jpg" alt="avatar" />
        <div className={style.userInfo}>
            <div className={style.name}>{personal.intro.name}</div>
            <div className={style.username}>@minhquan805</div>
        </div>
        <div className={style.contactIcons}>
            <a href={personal.about.socials.linkedin} target="_blank" rel="noopener noreferrer"><img src="/image/logo/linkedin.png" alt="linkedin" /></a>
            <a href={personal.about.socials.github} target="_blank" rel="noopener noreferrer"><img src="/image/logo/github.png" alt="GitHub" /></a>
            <a href={personal.about.socials.facebook} target="_blank" rel="noopener noreferrer"><img src="/image/logo/facebook.png" alt="Facebook" /></a>
        </div>
    </div>
  );
};

export default ContactCard;