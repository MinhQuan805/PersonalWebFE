import style from '@/styles/client/article/reading.module.css';

const ContactCard: React.FC= () => {
  return (
    <div className={style.profileCard}>
        <img className={style.avatar} src="/image/avatar.jpg" alt="avatar" />
        <div className={style.userInfo}>
            <div className={style.name}>Minh Quân</div>
            <div className={style.username}>@minhquan805</div>
        </div>
        <div className={style.contactIcons}>
            <a href="https://www.linkedin.com/in/qu%C3%A2n-v%C3%B5-821704325/" target="_blank" rel="noopener noreferrer"><img src="/image/logo/linkedin.png" alt="linkedin" /></a>
            <a href="https://github.com/MinhQuan805" target="_blank" rel="noopener noreferrer"><img src="/image/logo/github.png" alt="GitHub" /></a>
            <a href="https://www.facebook.com/quan.minh.780514/" target="_blank" rel="noopener noreferrer"><img src="/image/logo/facebook.png" alt="Facebook" /></a>
        </div>
    </div>
  );
};

export default ContactCard;
