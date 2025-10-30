# Test Issues Summary

Generated: October 30, 2025

## Overall Status
- **Total Test Suites**: 19
- **Passed**: 1 (Volumes-test.js)
- **Failed**: 18

---

## Failed Test Files with Issues

### 1. ❌ `__tests__/App-test.js`
**Status**: 0 tests run
**Main Issue**: 
- `TypeError: Sentry.wrap is not a function`

**Fix Needed**: Update Sentry mock to include `wrap` function

---

### 2. ⚠️ `__tests__/screens/AddDevice-test.js`
**Status**: Test suite failed to run
**Main Issues**:
- `ReferenceError: Provider is not defined`
- `ReferenceError: writeDataTolocalStorage is not defined`
- Multiple "Jest environment torn down" errors

**Fix Needed**: Fix imports and test setup, ensure Provider is properly mocked

---

### 3. ⚠️ `__tests__/screens/BluetoothDevicesList-test.js`
**Status**: 8 failed, 9 passed, 17 total
**Main Issues**:
- `TypeError: Cannot read properties of undefined (reading 'CharacteristicReadFailed')`
- `TypeError: BackHandler.removeEventListener is not a function`
- 1 snapshot failed

**Fix Needed**: Update BLE error handling mocks and BackHandler mock

---

### 4. ❌ `__tests__/screens/FloatingButtonManageSchool-test.js`
**Status**: 0 tests run
**Main Issue**:
- `ReferenceError: Jest environment torn down`
- Tests attempting to access `.root` on unmounted test renderer

**Fix Needed**: Wrap component creation in proper test lifecycle

---

### 5. ⚠️ `__tests__/screens/Header-test.js`
**Status**: 1 failed, 2 passed, 3 total
**Main Issues**:
- Multiple "Jest environment torn down" errors
- 1 snapshot failed

**Fix Needed**: Fix test cleanup and update snapshots

---

### 6. ❌ `__tests__/screens/ManageSchool-test.js`
**Status**: 0 tests run
**Main Issue**:
- `ReferenceError: create is not defined`

**Fix Needed**: Import `create` from react-test-renderer

---

### 7. ⚠️ `__tests__/screens/Scanner-test.js`
**Status**: 9 failed, 2 passed, 11 total
**Main Issues**:
- Multiple "Jest environment torn down" errors
- 1 snapshot failed

**Fix Needed**: Fix async test handling and update snapshots

---

### 8. ❌ `__tests__/screens/SchoolDevicesList-test.js`
**Status**: 0 tests run
**Main Issues**:
- Tests attempting to access `.root` on unmounted test renderer
- "Jest environment torn down" errors

**Fix Needed**: Fix component lifecycle in tests

---

### 9. ⚠️ `__tests__/screens/SetPasscode-test.js`
**Status**: 3 failed, 1 passed, 4 total
**Main Issues**:
- Navigation spy not being called as expected
- 1 snapshot failed

**Fix Needed**: Fix navigation mocks and update snapshots

---

### 10. ⚠️ `__tests__/screens/Splash-test.js`
**Status**: 7 failed, 1 passed, 8 total
**Main Issues**:
- `TypeError: request is not a function` (react-native-permissions)
- "Jest environment torn down" errors
- 1 snapshot failed

**Fix Needed**: Update permissions mock to include `request` function

---

### 11. ⚠️ `__tests__/screens/TurnOnBluetooth-test.js`
**Status**: 4 failed, 4 passed, 8 total
**Main Issues**:
- `TypeError: bleManager.stopDeviceScan is not a function`
- 1 snapshot failed

**Fix Needed**: Add `stopDeviceScan` to BLE manager mock

---

### 12. ⚠️ `__tests__/screens/UpdateDevice-test.js`
**Status**: 8 failed, 4 passed, 12 total
**Main Issues**:
- `TypeError: Cannot read properties of undefined (reading 'props')`
- `TypeError: updateDevice is not a function`
- `TypeError: navigateToDeviceListing is not a function`
- 1 snapshot failed

**Fix Needed**: Fix action imports and mocks

---

### 13. ⚠️ `__tests__/screens/network/Network-test.js`
**Status**: 5 failed, 5 passed, 10 total
**Main Issues**:
- `TypeError: BackHandler.removeEventListener is not a function`
- 1 snapshot failed

**Fix Needed**: Update BackHandler mock to include `removeEventListener`

---

### 14. ⚠️ `__tests__/screens/serial/Serial-test.js`
**Status**: 6 failed, 3 passed, 9 total
**Main Issues**:
- `TypeError: Cannot read properties of undefined (reading 'forwardingBehaviour')`
- `TypeError: BackHandler.removeEventListener is not a function`
- 1 snapshot failed

**Fix Needed**: Fix serial settings mock and BackHandler mock

---

### 15. ❌ `__tests__/screens/settings/Settings-test.js`
**Status**: 0 tests run
**Main Issue**: Test suite failed to run

**Fix Needed**: Investigate test file for syntax/import errors

---

### 16. ⚠️ `__tests__/screens/volumes/Equalizer-test.js`
**Status**: 4 failed, 8 passed, 12 total
**Main Issues**:
- `Error: cannot write values because BLE is shutdown`
- Multiple BLE write operation failures

**Fix Needed**: Mock BLE write operations properly

---

### 17. ⚠️ `__tests__/screens/volumes/Input-test.js`
**Status**: 3 failed, 3 passed, 6 total
**Main Issues**:
- `TypeError: Cannot set properties of undefined (setting 'value')`
- `Error: cannot write values because BLE is shutdown`
- `TypeError: Cannot read properties of undefined (reading 'isMuted')`
- 1 snapshot failed

**Fix Needed**: Fix volume settings mock structure

---

### 18. ⚠️ `__tests__/screens/volumes/Output-test.js`
**Status**: 4 failed, 3 passed, 7 total
**Main Issues**:
- `Error: cannot read/write values because BLE is shutdown`
- `TypeError: Cannot read properties of undefined (reading 'isMuted')`
- 1 snapshot failed

**Fix Needed**: Fix BLE operations mock and volume settings structure

---

### ✅ 19. `__tests__/screens/volumes/Volumes-test.js`
**Status**: ✅ PASSING - 1 passed, 1 total
**Note**: 1 obsolete snapshot (can be cleaned up with `yarn test -u`)

---

## Common Issues Across Tests

### 1. **Snapshot Failures** (14 files)
Many tests have outdated snapshots. Can be updated with:
```bash
yarn test -u
```

### 2. **BackHandler Mock Issues** (4 files)
Missing `removeEventListener` function in BackHandler mock.

**Affected Files**:
- BluetoothDevicesList-test.js
- Network-test.js
- Serial-test.js

### 3. **BLE Manager Mock Issues** (5 files)
BLE operations returning undefined or "shutdown" errors.

**Affected Files**:
- TurnOnBluetooth-test.js
- Equalizer-test.js
- Input-test.js
- Output-test.js

### 4. **Jest Environment Teardown** (8 files)
Components trying to access properties after test environment is torn down.

**Affected Files**:
- AddDevice-test.js
- FloatingButtonManageSchool-test.js
- Header-test.js
- Scanner-test.js
- SchoolDevicesList-test.js
- Splash-test.js
- Volumes-test.js

### 5. **Sentry Mock** (1 file)
Missing `wrap` function in Sentry mock.

**Affected Files**:
- App-test.js

---

## Recommended Fix Priority

### Priority 1 - Quick Wins (Mock Updates)
1. Update Sentry mock to add `wrap` function
2. Update BackHandler mock to add `removeEventListener`
3. Update BLE Manager mock to add `stopDeviceScan`
4. Update Permissions mock to add `request` function

### Priority 2 - Test Structure Issues
1. Fix component lifecycle issues (environment teardown)
2. Fix missing imports (Provider, create, etc.)
3. Fix navigation mocks

### Priority 3 - Snapshot Updates
Run `yarn test -u` to update all snapshots after fixing logic issues

---

## Next Steps

1. **Update Mock Files** in `__tests__/__mocks__/` directory:
   - `sentry-mock.js` - Add `wrap` function
   - `react-native-ble-plx-mock.js` - Add `stopDeviceScan`
   - `react-native-permissions-mock.js` - Add `request` function
   - Add BackHandler mock with `removeEventListener`

2. **Fix Test Structure**:
   - Ensure proper cleanup in test files
   - Use `act()` for async state updates
   - Fix component mounting/unmounting

3. **Update Snapshots**:
   - After fixing logic, run `yarn test -u`

4. **Verify**:
   - Run `yarn test` to verify all fixes work

---

## Configuration Status

✅ Jest configuration is properly set up in `package.json`
✅ Transform patterns configured for React Native modules
✅ Mock setup files are configured
✅ Tests are running successfully

The failing tests are due to **test-specific issues** (outdated mocks, snapshots, test logic), not configuration problems.

