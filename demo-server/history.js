import faker from 'faker';

const HistoryServer = () => {
    let clients = [];

    const needDataLength = 15;
    for (let i = 0; i < needDataLength; i++) {
        clients.push({
            id: i,
            transactionId:faker.random.number(),
            purchasedItem:faker.commerce.productName(), 
            amount:faker.commerce.price(),
            transactionDate:faker.date.past(),
            merchant:faker.name.findName()
        });
    }
    return {clients}
}

export default HistoryServer;