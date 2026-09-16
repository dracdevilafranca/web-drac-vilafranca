export type PrivacySection = { heading: string; body: string }
export type PrivacyContent = { sections: PrivacySection[] }

const contact = {
    entity:  'Amics del Drac de Vilafranca del Penedès',
    address: 'Carrer Escorxador, 19-21, 08720 Vilafranca del Penedès',
    email:   'drac@dracdevilafranca.com',
    aepd:    'www.aepd.es',
}

export const privacyContent: Record<string, PrivacyContent> = {
    ca: {
        sections: [
            {
                heading: 'Responsable del tractament',
                body: `${contact.entity}, amb adreça a ${contact.address} i correu de contacte ${contact.email}.`,
            },
            {
                heading: 'Dades recollides',
                body: `Aquest web no recull dades personals mitjançant formularis. Si ens escriviu per correu electrònic, tractarem les dades que ens faciliteu: nom, adreça de correu electrònic i el contingut del missatge.`,
            },
            {
                heading: 'Finalitat',
                body: `Atendre les vostres consultes i, si és el cas, gestionar l'adquisició d'articles de la botiga.`,
            },
            {
                heading: 'Legitimació',
                body: `El tractament es basa en el consentiment de l'interessat en posar-se en contacte amb nosaltres, d'acord amb l'article 6.1.a del Reglament General de Protecció de Dades (RGPD).`,
            },
            {
                heading: 'Conservació',
                body: `Les dades es conservaran el temps necessari per atendre la vostra consulta i, com a màxim, un any, o fins que se'n sol·liciti la supressió.`,
            },
            {
                heading: 'Destinataris',
                body: `No se cediran dades a tercers, excepte per obligació legal.`,
            },
            {
                heading: 'Galetes',
                body: `Aquest web no utilitza galetes pròpies ni de seguiment. Les tipografies es carreguen des de Google Fonts, de manera que el vostre navegador es connecta als servidors de Google per obtenir-les.`,
            },
            {
                heading: 'Drets',
                body: `Podeu exercir els drets d'accés, rectificació, supressió, limitació, portabilitat i oposició dirigint-vos a ${contact.email}. Si considereu que el tractament no és conforme a la normativa vigent, teniu dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (${contact.aepd}).`,
            },
        ],
    },
    es: {
        sections: [
            {
                heading: 'Responsable del tratamiento',
                body: `${contact.entity}, con dirección en ${contact.address} y correo de contacto ${contact.email}.`,
            },
            {
                heading: 'Datos recogidos',
                body: `Este sitio web no recoge datos personales mediante formularios. Si nos escribís por correo electrónico, trataremos los datos que nos facilitéis: nombre, dirección de correo electrónico y el contenido del mensaje.`,
            },
            {
                heading: 'Finalidad',
                body: `Atender vuestras consultas y, en su caso, gestionar la adquisición de artículos de la tienda.`,
            },
            {
                heading: 'Legitimación',
                body: `El tratamiento se basa en el consentimiento del interesado al ponerse en contacto con nosotros, de acuerdo con el artículo 6.1.a del Reglamento General de Protección de Datos (RGPD).`,
            },
            {
                heading: 'Conservación',
                body: `Los datos se conservarán el tiempo necesario para atender vuestra consulta y, como máximo, un año, o hasta que se solicite su supresión.`,
            },
            {
                heading: 'Destinatarios',
                body: `No se cederán datos a terceros, salvo obligación legal.`,
            },
            {
                heading: 'Cookies',
                body: `Este sitio web no utiliza cookies propias ni de seguimiento. Las tipografías se cargan desde Google Fonts, por lo que vuestro navegador se conecta a los servidores de Google para obtenerlas.`,
            },
            {
                heading: 'Derechos',
                body: `Podéis ejercer los derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición dirigiéndoos a ${contact.email}. Si consideráis que el tratamiento no es conforme a la normativa vigente, tenéis derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (${contact.aepd}).`,
            },
        ],
    },
    en: {
        sections: [
            {
                heading: 'Data controller',
                body: `${contact.entity}, located at ${contact.address}, contact email: ${contact.email}.`,
            },
            {
                heading: 'Data collected',
                body: `This website does not collect personal data through forms. If you contact us by email, we will process the data you provide: your name, email address and the content of your message.`,
            },
            {
                heading: 'Purpose',
                body: `To answer your enquiries and, where applicable, to arrange the purchase of items from the shop.`,
            },
            {
                heading: 'Legal basis',
                body: `Processing is based on the consent you give by contacting us, in accordance with Article 6(1)(a) of the General Data Protection Regulation (GDPR).`,
            },
            {
                heading: 'Retention',
                body: `Data will be kept for as long as needed to answer your enquiry and for no more than one year, or until deletion is requested.`,
            },
            {
                heading: 'Recipients',
                body: `Data will not be shared with third parties except as required by law.`,
            },
            {
                heading: 'Cookies',
                body: `This website does not use its own or tracking cookies. Fonts are loaded from Google Fonts, which means your browser connects to Google's servers to fetch them.`,
            },
            {
                heading: 'Your rights',
                body: `You may exercise your rights of access, rectification, erasure, restriction, portability and objection by contacting ${contact.email}. If you believe processing does not comply with applicable law, you have the right to lodge a complaint with the Spanish Data Protection Agency (${contact.aepd}).`,
            },
        ],
    },
}
