const WebSocket = require('ws');
const { chromium } = require('playwright-chromium');
const Captcha = require('2captcha');
var solver = new Captcha.Solver('peterparkson');

var accounts = ['', 'grownupmissing','discoverypartis'];

var captchas = [];

var rainId = '261353';

var sessions = [];

var claims = 0;

var ant = 0;

var bypas = 0;

var vs = 0;

function app() {
  const ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');

  ws.on('open', function open() {
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
    ws.send('PASS oauth:aasiocnxbd2u27m9hu81cazlhii7p5');
    ws.send('NICK lemuruid');
    ws.send('USER lemuruid 8 * :lemuruid');
    ws.send('JOIN #polainum');
    ws.send(
      '@client-nonce=0b36720558db13d2a138cc4039bb9d8f PRIVMSG #polainum :Worker accounts : ' +
        accounts
    );
    setInterval(() => {
      ws.send('3');
    }, 2000);
  });

  ws.onmessage = function (message) {
    var g = message.data.split(';');

    if (g.length == 17) {
      if (g[4].match(/polai/i)) {
        var msg = g[16].split(':')[2].trim();

        switch (msg) {
          case 'shutdown':
            process.exit();
            break;
          case 'resetvar':
            vs = 0;
            ant = 0;
            bypas = 0;
            claims = 0;
            break;
          case 'balance':
            getbalance();
            break;
            case 'checkfree':
                checkfree()
                break;
          case 'bet':
            bet();
            break;
          case 'ws':
            if (vs === 1) {
              return;
            } else {
              gamws();
            }
            break;
          case 'bypass':
            if (bypas === 1) {
              console.log('bypass is already working!');
              return;
            } else {
              bypass();
            }
            break;
          case 'claim':
            if (claims === 1) {
              console.log('claim is already working!');
              return;
            } else {
              claim(captchas);
            }
            break;
          case 'catest':
            console.log(rainId);
            console.log('Total Captchas Number : ' + captchas.length);
            break;
          case 'rainid':
            if (rainId === '') {
              console.log('Waiting for rainId');
            } else {
              console.log(rainId);
            }
            break;
          case 'racc':
            if (ant === 1) {
              console.log('racc is already working!');
              return;
            } else {
              accounts.forEach((u, i) => {
                if (i === 0) {
                  return;
                } else {
                  racc(u, i);
                }
              });
            }
            break;
          case 'ant':
            console.log(sessions);
            break;
          case 'ttt':
            console.log(
              'Bypass : ' +
                bypas +
                ' Sessions : ' +
                ant +
                ' Claims : ' +
                claims +
                ' Ws : ' +
                vs
            );
        }
      }
    }
  };

  ws.onerror = function (msg) {
    setTimeout(() => {
      console.log(i + ' Trying to reconnect.');
      app();
    }, 2500);
  };
}
app();

gamws();

accounts.forEach((u, i) => {
  if (u.length < 3) {
    return;
  } else {
    racc(u, i);
  }
});

async function gamws() {
  vs = 1;
  console.log('trying to lsitening rain');
  var ws = new WebSocket(
    'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
    {
      origin: 'https://trgamdom.com',
      headers: {
        Cookie:  `you_are_being_scammed_NEVER_send_this_to_anyone!_And_don't_expect_us_to_refund_you_either_if_you_get_scammed_by_sending_someone_the_value_of_this_cookie._None_of_our_support_will_ever_ask_you_for_it%2C_there_is_no_bullshit_secret_jackpot_you_get_by_ignoring_this%2C_you'll_just_get_your_money_taken._Whoever_you_have_been_interacting_with_is_a_scammer%2C_please_report_them_to_us.____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________.1c692318-1773-4dc8-b0ab-a0f32c15b93d`,
      },
    }
  );

  ws.on('open', function () {
    console.log('Listening...');
    ws.send('40/general,');
    ws.send('40/p2p,');
    ws.send('42/general,0["get_wallets",null]');
    ws.send('40/crypto,');
    ws.send(
      '42/general,1["get_currency",{"displayCurrency":"USD","walletUnit":"COINS"}]'
    );
    ws.send('40/external-games,');
    ws.send('40/chat,');
    ws.send('42/chat,0["join",["english","turkish"]]');
    setInterval(() => {
      ws.send('2');
    }, 2000);
  });

  ws.onmessage = function (msg) {
    if (
      msg.data.includes('activateRain') ||
      msg.data.includes('activeRain') ||
      msg.data.includes('Free Money')
    ) {
      console.log(msg.data.toString());
      if (msg.data.includes('custom')) {
        var r = msg.data.split(':').toString();
        var rain = r.split(',');
        rainId = rain[3];
        var raina = rain[9].toString().split('}]');
        var rainamount = Number(raina[0]);
        if (msg.data.includes(false) || msg.data.includes('false')) {
          claim();
          setTimeout(() => {
            bet();
          }, 180000);
        }
      }
    }
  };

  ws.onerror = function (msg) {
    setTimeout(() => {
      gamws();
    }, 2500);
  };
}

// BYPASS

async function bypass() {
  bypas = 1;
  try {
    console.log('Trying to solve 50 captcha');

    for (i = 0; i < 5; i++) {
      async function ohmy() {
        solver
          .hcaptcha(
            '6c6dfaea-16cc-4db1-b94c-c9c13b712617',
            'https://trgamdom.com/'
          )
          .then((res) => {
            captchas.push(res.data);
            var timeout = setTimeout(function () {
              var index = captchas.indexOf(res.data);
              if (index !== -1) {
                captchas.splice(index, 1);
                ohmy();
              }
            }, 120000);
          });
      }
      ohmy();
    }
  } catch (e) {
    bypass();
    console.log('On error reconnecting to 2captcha...');
  }
}

// CLAIM

async function claim() {
  claims = 1;
  try {
    sessions.forEach((u, i) => {
      console.log(u);
      createConnection(u);
      function createConnection() {
        var ws = new WebSocket(
          'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
          {
            origin: 'https://trgamdom.com',
            headers: {
              Cookie: u,
            },
          }
        );

        ws.on('open', function () {
          ws.send('40/general,');
          ws.send('40/p2p,');
          ws.send('42/general,0["get_wallets",null]');
          ws.send('40/crypto,');
          ws.send(
            '42/general,1["get_currency",{"displayCurrency":"USD","walletUnit":"COINS"}]'
          );
          ws.send('40/external-games,');
          ws.send('40/chat,');
          ws.send('42/chat,0["join",["english","newcomers"]]');
          setTimeout(() => {
            claimrain();
          }, 2000);
          setInterval(() => {
            ws.send('2');
          }, 2000);
        });

        ws.onmessage = function (msg) {
          if (
            msg.data.length < 300 &&
            msg.data.length > 25 &&
            !msg.data.includes('general') &&
            !msg.data.includes('rid')
          ) {
            if (
              msg.data.includes('rainJoinSuccess') ||
              msg.data.includes('rainJoinSuccess_') ||
              msg.data.includes('rainJoin')
            ) {
              console.log('Rain claimed with account : ' + i);
            }
            console.log(msg.data);
          }
        };

        function claimrain() {
          console.log('Trying to claim rain ' + i);
          setTimeout(() => {
            if (captchas[i] == undefined || captchas[i] == null) {
              ws.send(
                '42/chat,4["claimRain",{"captchaResponse":"' +
                  'assume-unneeded' +
                  '","rainId":' +
                  rainId +
                  ',"walletInfo":{"amount":0,"unit":"COINS","displayCurrency":"USD"}}]'
              );
            } else {
              if (
                captchas[i].includes('P0_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9')
              ) {
                ws.send(
                  '42/chat,4["claimRain",{"captchaResponse":"' +
                    captchas[i] +
                    '","rainId":' +
                    rainId +
                    ',"walletInfo":{"amount":0,"unit":"COINS","displayCurrency":"USD"}}]'
                );
              } else {
                ws.send(
                  '42/chat,4["claimRain",{"captchaResponse":"' +
                    'P0_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
                    captchas[i] +
                    '","rainId":' +
                    rainId +
                    ',"walletInfo":{"amount":0,"unit":"COINS","displayCurrency":"USD"}}]'
                );
              }
            }
          }, 1500);
        }

        ws.onerror = function (msg) {
          setTimeout(() => {
            console.log(i + ' Trying to reconnect.');
            createConnection();
          }, 2500);
        };

        setTimeout(() => {
          claims = 0;
          console.log('Claim Websocket is closed.');
          ws.close();
        }, 90000);
      }
    });
  } catch (e) {
    console.log('anen');
  }
}

// LOGIUN ACC

async function racc(u, i) {
  ant = 1;
  const browser = await chromium.launch({ chromiumSandbox: false });
  try {
    console.log('Username : ' + u + ' ' + i);
    const context = await browser.newContext({ locale: 'en-GB' });
    const gamdom = await context.newPage();
    gamdom.goto('https://trgamdom.com');
    await new Promise((resolve) => setTimeout(resolve, i * 10000));
    async function xx() {
      const data = await {
        a: u,
        p: "159753456Ea@/'",
        h: i,
        c: 'assume-unneeded',
      };
      await gamdom.evaluate((data) => {
        fetch('https://trgamdom.com/login2', {
          mode: 'cors',
          headers: {
            'accept-language': 'en-GB',
            'content-type': 'application/json; charset=utf-8',
            'sec-ch-ua': '"/Not)A;Brand";v="24", "Chromium";v="104"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Access-Control-Allow-Origin': '*',
            Referer: 'https://trgamdom.com/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Access-Control-Allow-Origin': 'https://trgamdom.com/login2',
          },
          body:
            '{"username":"' +
            data.a +
            '","password":"' +
            data.p +
            '","captcha_solution":"' +
            data.c +
            '","totp_token":""}',
          method: 'POST',
        }).then(
          setTimeout(() => {
            location.reload();
          }, 5000)
        );
      }, data);
      await new Promise((resolve) => setTimeout(resolve, i * 10000));
      const cookies = await context.cookies('https://trgamdom.com/');
      try {
        const authToken = await cookies.find(
          (cookie) => cookie.name === 'secret_session_do_not_share'
        ).value;
        const LaUserDetails = await cookies.find(
          (cookie) => cookie.name === 'LaUserDetails'
        ).value;
        var session =
          'secret_session_do_not_share=' +
          authToken +
          ';LaUserDetails=' +
          LaUserDetails;
        sessions.push(session);
        await browser.close();
      } catch (e) {
        racc(u, i);
      }
    }
    xx();
  } catch (e) {
    console.log(e);
    await browser.close();
    racc(u, i);
  }
}

// BET

async function bet() {
  sessions.forEach((u, i) => {
    var ws = new WebSocket(
      'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
      {
        origin: 'https://trgamdom.com',
        headers: {
          Cookie: u,
        },
      }
    );

    ws.on('open', function () {
      ws.send('40/general,');
      ws.send('40/tradeup,');
      ws.send('42/chat,0["join",["english","turkish"]]');
      setTimeout(() => {
        ws.send('42/general,0["get_wallets",null]');
      }, 1000);
      setInterval(() => {
        ws.send('2');
      }, 2000);
    });

    ws.onmessage = function (msg) {
      if (msg.data.includes('unit') && msg.data.length < 1500) {
        var bla = msg.data.split(':')[2];
        var balance = bla.split(',')[0];

        // BET GELİCEK

        var ws = new WebSocket(
          'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
          {
            origin: 'https://trgamdom.com',
            headers: {
              Cookie: u,
            },
          }
        );

        ws.on('open', function () {
          ws.send('40/general,');
          ws.send('40/tradeup,');
          ws.send('42/chat,0["join",["english","turkish"]]');
          setTimeout(() => {
            ws.send(
              '42/tradeup,0["createTradeup",{"bet":{"type":"coins","amount":' +
                balance +
                '},"target":{"type":"coins","amount":8325},"displayReversed":false,"animationDuration":2900,"isAutobet":false,"walletInfo":{"amount":15,"unit":"COINS","displayCurrency":"USD"}}]'
            );
            setTimeout(() => {
              ws.close();
            }, 2500);
          }, 1000);
          setInterval(() => {
            ws.send('2');
          }, 2000);
        });
      }
    };

    setTimeout(() => {
      ws.close();
    }, 30000);
  });
}

// balance

async function getbalance() {
  sessions.forEach((u, i) => {
    var ws = new WebSocket(
      'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
      {
        origin: 'https://trgamdom.com',
        headers: {
          Cookie: u,
        },
      }
    );

    ws.on('open', function () {
      ws.send('40/general,');
      ws.send('40/tradeup,');
      ws.send('42/chat,0["join",["english","turkish"]]');
      setTimeout(() => {
        ws.send('42/general,0["get_wallets",null]');
      }, 1000);
      setInterval(() => {
        ws.send('2');
      }, 2000);
    });

    ws.onmessage = function (msg) {
      if (msg.data.includes('unit') && msg.data.length < 1500) {
        var bla = msg.data.split(':')[2];
        var balance = bla.split(',')[0];
        if (balance > -1) {
          const ws = new WebSocket('wss://irc-ws.chat.twitch.tv/');

          ws.on('open', function open() {
            ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            ws.send('PASS oauth:aasiocnxbd2u27m9hu81cazlhii7p5');
            ws.send('NICK lemuruid');
            ws.send('USER lemuruid 8 * :lemuruid');
            ws.send('JOIN #polainum');
            ws.send(
              '@client-nonce=0b36720558db13d2a138cc4039bb9d8f PRIVMSG #polainum :' +
                accounts[i + 1] +
                ' balance is : ' +
                balance
            );
            setInterval(() => {
              ws.send('3');
            }, 2000);
          });
        }

        console.log(accounts[i + 1] + ' balance is : $' + balance / 1500);
        ws.close();
      }
    };
  });
}

function checkfree(){
    sessions.forEach((u, i) => {

    var ws = new WebSocket(
        'wss://trgamdom.com/socket.io/?EIO=3&transport=websocket',
        {
          origin: 'https://trgamdom.com',
          headers: {
            Cookie: u,
          },
        }
      );
    
    
      ws.on('open', function () {
        console.log('Listening...');
        ws.send('40/general,');
        ws.send('40/p2p,');
        ws.send('42/general,0["get_wallets",null]');
        ws.send('40/crypto,');
        ws.send(
          '42/general,1["get_currency",{"displayCurrency":"USD","walletUnit":"COINS"}]'
        );
        ws.send('42/general,1["get_wallets",null]')
        setInterval(() => {
          ws.send('2');
        }, 2000);
      });
    
      ws.onmessage = function (msg) {
        if(msg.data.includes('notifications')){
            if(msg.data.split('data')[1]) {
                console.log(msg.data.split('data')[1])
            } else {
                console.log('No free spins in account.')
            }
        }
      };
    
      ws.onerror = function (msg) {
        setTimeout(() => {
          checkfree();
        }, 2500);
      };
    
      setTimeout(() => {
        console.log('Free Spins is closed.');
        ws.close();
      }, 30000);
    })
    
    }