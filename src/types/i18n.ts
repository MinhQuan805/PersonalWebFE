// types/i18n.ts
export interface Socials {
  linkedin: string;
  github: string;
  facebook: string;
}

export interface Info {
  phone: string;
  email: string;
  address: string;
}

export interface Intro {
  greeting: string;
  name: string;
  highlight: string;
  description: string[];
  roles: string[];
  resume_button: string;
  resume_file: string;
  avatar: string;
}

export interface About {
  headline: string;
  story: string[];
  logo: string;
  name: string;
  info: Info;
  socials: Socials;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface CommonTranslation {
  intro: Intro;
  about: About;
  testimonials: Testimonial[];
  testimonial_title: string;
  mission_title: string;
  mission_solve: string;
  mission_ux: string;
  mission_grow: string;
  mission_secure: string;
  product_title: string;
  product_button: string;
  article_title: string;
  article_description: string;
  article_button: string;
  pricing_title: string;
  pricing_description: string;
  pricing_backend_title: string;
  pricing_feature_performance: string;
  pricing_feature_integration: string;
  pricing_feature_scalability: string;
  pricing_feature_security: string;
  pricing_price: string;
  pricing_button: string;
  contact_title: string;
  contact_info_title: string;
  contact_form_name: string;
  contact_form_email: string;
  contact_form_subject: string;
  contact_form_message: string;
  contact_form_submit: string;
  contact_form_name_required: string;
  loading_products: string;
  loading_articles: string;
  intro_prefix: string;
}