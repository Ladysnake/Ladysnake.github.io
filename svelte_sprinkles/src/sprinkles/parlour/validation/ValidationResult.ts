import type {StateType} from "../model/BlabberDialogue";

export abstract class ValidationWarning {
  state: string;

  protected constructor(state: string) {
    this.state = state;
  }

  abstract message(): string;
}

export class UnreachableWarning extends ValidationWarning {
  constructor(state: string) {
    super(state);
  }
  message(): string { return `${this.state} is unreachable`; }
}

export class StrandedWarning extends ValidationWarning {
  constructor(state: string) {
    super(state);
  }
  message(): string { return `${this.state} is unreachable and does not have any path to the end of the dialogue`; }
}

export class ConditionalSoftLock extends ValidationWarning {
  constructor(state: string) { super(state); }
  message(): string { return `${this.state} only has conditional paths to the end of the dialogue`; }
}

export abstract class ValidationError {
  state;

  protected constructor(state: string) {
    this.state = state;
  }

  abstract message(): string;
}

export class NoChoiceError extends ValidationError {
  constructor(state: string) {
    super(state);
  }

  message(): string {
    return `State "${this.state}" has no available choices but is not an end state`;
  }
}

function toOrdinal(n: number) {
  if (n % 10 == 1 && n % 100 != 11) {
    return n + 'st';
  } else if (n % 10 == 2 && n % 100 != 12) {
    return n + 'nd';
  } else if (n % 10 == 3 && n % 100 != 13) {
    return n + 'rd';
  } else {
    return n + 'th';
  }
}

export class NoTextError extends ValidationError {
  constructor(state: string, public readonly invalidIndices: number[]) {
    super(state);
  }

  message(): string {
    const invalidChoices = this.invalidIndices.map((n) => toOrdinal(n + 1));
    if (invalidChoices.length > 1) {
      return (`${invalidChoices.join(', ')} choices in state "${this.state}" have no text`);
    } else {
      return (`${invalidChoices[0]} choice in state "${this.state}" has no text`);
    }
  }
}

export class SoftLockError extends ValidationError {
  constructor(state: string) {
    super(state);
  }

  message(): string {
    return `${this.state} does not have any path to the end of the dialogue`;
  }
}

export class NonexistentIllustration extends ValidationError {
  illustration;

  constructor(state: string, illustration: string) {
    super(state);
    this.illustration = illustration;
  }

  message(): string {
    return this.state + " references non-existent illustration " + this.illustration;
  }
}

export class InvalidIllustratedState extends ValidationError {
  type;
  illustrations;

  constructor(state: string, type: StateType, illustrations: string[]) {
    super(state);
    this.type = type;
    this.illustrations = illustrations;
  }

  message(): string {
    return this.state + " of type " + this.type + " is not allowed to use illustrations " + this.illustrations;
  }
}
