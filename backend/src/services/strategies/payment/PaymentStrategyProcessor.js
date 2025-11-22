

class PaymentStrategyProcessor {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    pay(amount) {
        return this.strategy.pay(amount);
    }
}

export default PaymentStrategyProcessor;