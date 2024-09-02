import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationPL from './text.json';

i18n.use(initReactI18next).init({
	resources: {
		pl: {
			translation: translationPL,
		},
	},
	lng: 'pl', // Ustawienie domyślnego języka
	fallbackLng: 'pl', // Język zapasowy
	interpolation: {
		escapeValue: false, // React automatycznie zabezpiecza przed XSS
	},
});

export default i18n;
