#include "cinder/app/App.h"
#include "cinder/app/RendererGl.h"
#include "cinder/gl/gl.h"
#include "cinder/Utilities.h"

#include <iomanip>
#include <sstream>

using namespace ci;
using namespace ci::app;
using namespace std;

// F: move forward one step
// L: turn left 90°
// R: turn right 90°

static const int F = 0;
static const int L = 1;
static const int R = 2;

static const int ITERATIONS = 9;

class LSystemApp : public App
{
public:

    void setup() override;

    void interpretLSystem();

    void pushDragonPositions();

    void keyDown(KeyEvent event) override;

	void update() override;
	void draw() override;

    std::vector<int> mDragonCurve;
    std::vector<ivec2> mDragonPositions;

    int mCounter;

    float mCurrentAngle;
    int mDistance;
    int mAngle;

    int mStep;

    ivec2 mPos;

    bool mSaveFrames;
};

void LSystemApp::setup()
{
    mSaveFrames = false;

    mCounter = 1;

    mCurrentAngle = 0;
    mDistance = 10;
    mAngle = 90;

    mPos = vec2(getWindowWidth() / 5, getWindowHeight() / 1.5f);

    interpretLSystem();

    pushDragonPositions();
}

void LSystemApp::interpretLSystem()
{
    // Rules

    std::vector<int> lStep = { F, L, F };
    std::vector<int> rStep = { F, R, F };

    // Produces

    // F
    // F L F
    // F L F L F R F
    // F L F L F R F L F L F R F R F
    // F L F L F R F L F L F R F R F L F L F L F R F R F L F R F R F

    for (int i = 0; i < ITERATIONS; i++) {
        mDragonCurve = lStep;
        mDragonCurve.insert(mDragonCurve.end(), 1);
        mDragonCurve.insert(mDragonCurve.end(), rStep.begin(), rStep.end());

        lStep.insert(lStep.end(), 2);
        lStep.insert(lStep.end(), rStep.begin(), rStep.end());
        rStep = lStep;

        lStep = mDragonCurve;
    }

    std::reverse(mDragonCurve.begin(), mDragonCurve.end());
}

void LSystemApp::pushDragonPositions()
{
    for (auto i: mDragonCurve) {
        mPos.x = mPos.x + mDistance * cos(glm::radians(mCurrentAngle));
        mPos.y = mPos.y + mDistance * sin(glm::radians(mCurrentAngle));

        if (i == L) {
            mCurrentAngle += mAngle;
        } else if (i == R) {
            mCurrentAngle -= mAngle;
        }

        mDragonPositions.push_back(mPos);
    }
}

void LSystemApp::keyDown(KeyEvent event)
{
    if (event.getChar() == 's') {
        mSaveFrames = !mSaveFrames;
    } else if (event.getCode() == KeyEvent::KEY_ESCAPE) {
        quit();
    }
}

void LSystemApp::update()
{
    if (getElapsedFrames() % 2 == 0)
        mCounter++;

    if (mCounter == mDragonPositions.size())
        mCounter = 1;
}

void LSystemApp::draw()
{
    gl::clear(Color(0.1f, 0.1f, 0.1f));
    gl::enableAlphaBlending(true);

    for (int i = 0; i < mCounter; i++) {

        float rel = i / (float)mDragonPositions.size();

        gl::color(Color(CM_HSV, rel, 1, 1));

        if (i > 0)
            gl::drawLine(mDragonPositions[i - 1], mDragonPositions[i]);

        if (i % 2 != 0)
            gl::drawSolidCircle(mDragonPositions[i], 7);
    }

    if (mSaveFrames) {
        static int currentFrame = 0;
        stringstream ss;

        ss << setfill('0') << setw(4) << (currentFrame++);

        writeImage(getHomeDirectory() / "af" / "CinderScreengrabs" / ("LSystem_" + ss.str() + ".png"), copyWindowSurface());
    }
}


CINDER_APP(LSystemApp, RendererGl, [](App::Settings *settings) {
    settings->setTitle("L-system parallel rewriting system - Dragon Curve");
    settings->setWindowSize(1280, 720);
    settings->setResizable(false);
    settings->disableFrameRate();
})
