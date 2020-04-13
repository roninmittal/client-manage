import faker from 'faker';

const ContactServer = () => {
    let clients = [];

    const needDataLength = 50
    for (let i = 0; i < needDataLength; i++) {
        clients.push({
            id: i,
            name: faker.name.findName(),
            company: faker.company.companyName(),
            industry: faker.commerce.department(),
            title: faker.name.title(),
            address: faker.address.streetAddress()
        })
    }
    return {clients}
}

export default ContactServer;