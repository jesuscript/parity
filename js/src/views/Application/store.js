// Copyright 2015, 2016 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import { action, observable } from 'mobx';

export default class Store {
  @observable firstrunVisible = false;

  constructor (api) {
    this._api = api;

    const value = window.localStorage.getItem('showFirstRun');
    if (value) {
      this.firstrunVisible = JSON.parse(value);
    }

    this._checkAccounts();
  }

  @action closeFirstrun = () => {
    this.toggleFirstrun(false);
  }

  @action toggleFirstrun = (visible = false) => {
    this.firstrunVisible = visible;
    window.localStorage.setItem('showFirstRun', JSON.stringify(!!visible));
  }

  _checkAccounts () {
    this._api.parity
      .allAccountsInfo()
      .then((info) => {
        const accounts = Object.keys(info).filter((address) => info[address].uuid);

        this.toggleFirstrun(this.firstrunVisible || !accounts || !accounts.length);
      })
      .catch((error) => {
        console.error('checkAccounts', error);
      });
  }
}
